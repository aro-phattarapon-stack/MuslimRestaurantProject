
import "dotenv/config";

import crypto from "node:crypto";
import express from "express";
import helmet from "helmet";
import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";
import pg from "pg";

const { Pool } = pg;
const app = express();
const port = Number(process.env.PORT || 3001);
const geminiModel = process.env.GEMINI_MODEL || "gemini-4-argon";

const maxOtpAttempts = 5;
const isProduction = process.env.NODE_ENV === "production";
const emailProvider = process.env.EMAIL_PROVIDER || "resend";

if (
  !process.env.DATABASE_URL ||
  !process.env.GOOGLE_CLIENT_ID ||
  !process.env.SESSION_SECRET
) {
  throw new Error(
    "DATABASE_URL, GOOGLE_CLIENT_ID, and SESSION_SECRET are required"
  );
}

if (emailProvider !== "resend" && emailProvider !== "mailpit") {
  throw new Error("EMAIL_PROVIDER must be either 'resend' or 'mailpit'");
}

if (emailProvider === "mailpit" && isProduction) {
  throw new Error("Mailpit can only be used outside production");
}

if (emailProvider === "resend" && (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL)) {
  throw new Error("RESEND_API_KEY and RESEND_FROM_EMAIL are required when EMAIL_PROVIDER=resend");
}

if (emailProvider === "mailpit" && !process.env.MAIL_FROM_EMAIL) {
  throw new Error("MAIL_FROM_EMAIL is required when EMAIL_PROVIDER=mailpit");
}

if (process.env.SESSION_SECRET.length < 32) {
  throw new Error("SESSION_SECRET must contain at least 32 characters");
}

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: true } : undefined,
});

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const mailpitTransporter = emailProvider === "mailpit"
  ? nodemailer.createTransport({
      host: process.env.MAILPIT_HOST || "127.0.0.1",
      port: Number(process.env.MAILPIT_PORT || 1025),
      secure: false,
    })
  : null;

// Express middleware
app.set("trust proxy", 1);
app.use(helmet());
app.use(express.json({ limit: "16kb" }));

// Hash session token
function hashToken(token) {
  return crypto
    .createHash("sha256")
    .update(`${process.env.SESSION_SECRET}:${token}`)
    .digest("hex");
}

// Generate session token
function createSessionToken() {
  return crypto.randomBytes(32).toString("base64url");
}

// Generate 6-digit OTP
function createOtpCode() {
  return String(crypto.randomInt(100000, 1000000));
}

// Hash OTP
function hashOtp(code) {
  return crypto
    .createHash("sha256")
    .update(`${process.env.SESSION_SECRET}:${code}`)
    .digest("hex");
}

// Mask email address
function maskEmail(email) {
  const [localPart, domain] = email.split("@");
  return `${localPart.slice(0, 2)}***@${domain}`;
}

// Send OTP email using the selected local or production mail provider.
async function sendOtpEmail({ email, code }) {
  const text = `
Hello,

You requested a verification code to sign in to Halal Chiang Rai.

Your verification code is: ${code}

This code expires in 3 minutes and can only be used once.

If you did not request this code, please ignore this email.

Thank you,
Halal Chiang Rai Team
  `.trim();
  const html = `
      <!DOCTYPE html>
      <html>
        <body style="margin:0; padding:24px; background:#f5f5f5; font-family:Arial,sans-serif;">
          <div style="max-width:480px; margin:auto; padding:28px; background:#ffffff; border-radius:12px;">
            <h2 style="color:#166534; text-align:center;">Halal Chiang Rai</h2>
            <p>Hello,</p>
            <p>You requested a verification code to sign in to Halal Chiang Rai.</p>
            <div style="margin:24px 0; padding:20px; background:#f3f4f6; text-align:center; border-radius:8px;">
              <p style="margin:0 0 10px; color:#555;">Your verification code</p>
              <h1 style="margin:0; color:#166534; letter-spacing:8px;">${code}</h1>
            </div>
            <p>This code expires in <strong>3 minutes</strong> and can only be used once.</p>
            <p>If you did not request this code, please ignore this email.</p>
            <p style="margin-top:28px;">Thank you,<br /><strong>Halal Chiang Rai Team</strong></p>
          </div>
        </body>
      </html>
    `;

  if (emailProvider === "mailpit") {
    await mailpitTransporter.sendMail({
      from: process.env.MAIL_FROM_EMAIL,
      to: email,
      subject: "Your Halal Chiang Rai verification code",
      text,
      html,
    });
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL,
      to: [email],
      subject: "Your Halal Chiang Rai verification code",
      text,
      html,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);
    throw new Error(
      result?.message || `Resend request failed with status ${response.status}`
    );
  }
}

// Get client IP
function getClientIp(request) {
  return request.ip || request.socket.remoteAddress || "unknown";
}

// Get session token
function getSessionToken(request) {
  const header = request.get("authorization");

  if (header?.startsWith("Bearer ")) {
    return header.slice("Bearer ".length);
  }

  const cookie = request
    .get("cookie")
    ?.match(/(?:^|;\s*)halal_session=([^;]+)/);

  return cookie?.[1];
}

// Load authenticated user
async function loadUser(request, _response, next) {
  try {
    const token = getSessionToken(request);

    if (!token) return next();

    const result = await pool.query(
      `SELECT
         u.id,
         u.email,
         u.display_name AS "name",
         u.avatar_url AS "avatarUrl"
       FROM auth_sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = $1
         AND s.expires_at > NOW()`,
      [hashToken(token)]
    );

    request.user = result.rows[0] || null;

    return next();
  } catch (error) {
    return next(error);
  }
}

// Record login activity
async function recordLogin({
  userId,
  success,
  request,
  failureReason = null,
}) {
  await pool.query(
    `INSERT INTO login_events
      (user_id, provider, success, ip_address, user_agent, failure_reason)
     VALUES ($1, 'google', $2, $3, $4, $5)`,
    [
      userId,
      success,
      getClientIp(request),
      request.get("user-agent") || null,
      failureReason,
    ]
  );
}

// Apply user middleware
app.use(loadUser);

// Record access logs
app.use(async (request, response, next) => {
  response.on("finish", () => {
    pool
      .query(
        `INSERT INTO access_log
          (client_ip, http_method, endpoint_url, http_status, user_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          getClientIp(request),
          request.method,
          request.originalUrl,
          response.statusCode,
          request.user?.id || null,
        ]
      )
      .catch((error) => {
        console.error("Could not write access log:", error);
      });
  });

  next();
});

// Health check
app.get("/", (_request, response) => {
  return response.json({
    name: "Halal Chiang Rai API",
    health: "/api/health",
  });
});

app.get("/api/health", (_request, response) => {
  return response.json({ ok: true });
});

app.post("/api/recommendations", async (request, response) => {
  const { prompt } = request.body || {};
  if (typeof prompt !== "string" || !prompt.trim() || prompt.length > 500) {
    return response.status(400).json({
      error: "Please enter a prompt between 1 and 500 characters",
    });
  }

  if (!process.env.GEMINI_API_KEY) {
    return response.status(503).json({
      error: "Gemini is not configured. Add GEMINI_API_KEY to the server .env file.",
    });
  }

  const cuisineTypes = [
    "ทั้งหมด",
    "อาหารตามสั่ง",
    "อาหารไทย",
    "อาหารท้องถิ่น",
    "อาหารอาหรับ",
    "อาหารอินเดีย",
    "อาหารมาเลเซีย",
    "ร้านกาแฟ",
    "ของหวาน",
    "โรตีและของหวาน",
    "อาหารฮาลาล",
  ];
  const requestUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(geminiModel)}:generateContent`;

  let geminiResponse;
  try {
    geminiResponse = await fetch(requestUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{
            text: "คุณเป็นผู้ช่วยค้นหาร้านอาหารฮาลาลในจังหวัดเชียงราย อ่านคำขอภาษาไทยหรืออังกฤษแล้วแปลงเป็นตัวกรองเท่านั้น ห้ามแต่งข้อมูลร้านอาหาร ตอบเป็น JSON ตาม schema ที่กำหนด โดย message เป็นข้อความสั้นภาษาไทย",
          }],
        },
        contents: [{
          parts: [{
            text: `แปลงคำขอนี้เป็นตัวกรองร้านอาหาร: ${prompt.trim()}`,
          }],
        }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              zone: {
                type: "STRING",
                enum: ["ALL", "MFU", "CITY", "MAESAI", "OTHER"],
              },
              cuisine: {
                type: "STRING",
                enum: cuisineTypes,
              },
              maxBudget: {
                type: "INTEGER",
              },
              message: {
                type: "STRING",
              },
            },
            required: ["zone", "cuisine", "maxBudget", "message"],
          },
        },
      }),
      signal: AbortSignal.timeout(20_000),
    });
  } catch (error) {
    console.error("Gemini request failed:", error);
    return response.status(502).json({
      error: "Could not connect to Gemini. Please try again.",
    });
  }

  let result;
  try {
    result = await geminiResponse.json();
  } catch (error) {
    console.error("Gemini returned a non-JSON response:", error);
    return response.status(502).json({
      error: "Gemini returned an invalid response. Please try again.",
    });
  }

  if (!geminiResponse.ok) {
    console.error("Gemini API request was rejected:", result);
    return response.status(502).json({
      error: result.error?.message || "Gemini could not process the request.",
    });
  }

  const text = result.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();
  let recommendation;
  try {
    recommendation = JSON.parse(text);
  } catch (error) {
    console.error("Gemini returned malformed recommendation JSON:", error);
    return response.status(502).json({
      error: "Gemini returned an invalid recommendation. Please try again.",
    });
  }

  if (
    !recommendation ||
    !["ALL", "MFU", "CITY", "MAESAI", "OTHER"].includes(recommendation.zone) ||
    !cuisineTypes.includes(recommendation.cuisine) ||
    !Number.isInteger(recommendation.maxBudget) ||
    recommendation.maxBudget < 50 ||
    recommendation.maxBudget > 2000 ||
    typeof recommendation.message !== "string" ||
    recommendation.message.length > 160
  ) {
    console.error("Gemini recommendation did not match the expected schema");
    return response.status(502).json({
      error: "Gemini returned an invalid recommendation. Please try again.",
    });
  }

  return response.json(recommendation);
});

// Google authentication
app.post("/api/auth/google", async (request, response) => {
  const { credential } = request.body || {};

  if (
    typeof credential !== "string" ||
    credential.length > 10_000
  ) {
    return response.status(400).json({
      error: "Google credential is required",
    });
  }

  let payload;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    payload = ticket.getPayload();

    if (
      !payload?.sub ||
      !payload.email ||
      payload.email_verified !== true
    ) {
      throw new Error("Google email is not verified");
    }
  } catch (error) {
    await recordLogin({
      success: false,
      request,
      failureReason: "invalid_google_token",
    });

    console.error(
      "Google authentication failed:",
      error.message
    );

    return response.status(401).json({
      error: "Google authentication failed",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const userResult = await client.query(
      `INSERT INTO users
        (google_subject, email, display_name, avatar_url, email_verified, last_login_at)
       VALUES ($1, $2, $3, $4, TRUE, NOW())
       ON CONFLICT (google_subject) DO UPDATE SET
         email = EXCLUDED.email,
         display_name = EXCLUDED.display_name,
         avatar_url = EXCLUDED.avatar_url,
         email_verified = TRUE,
         last_login_at = NOW()
       RETURNING
         id,
         email,
         display_name AS "name",
         avatar_url AS "avatarUrl"`,
      [
        payload.sub,
        payload.email.toLowerCase(),
        payload.name || payload.email.split("@")[0],
        payload.picture || null,
      ]
    );

    const user = userResult.rows[0];

    const challengeId = crypto.randomUUID();
    const otpCode = createOtpCode();

    await client.query(
      `INSERT INTO otp_challenges
        (id, user_id, code_hash, expires_at)
       VALUES ($1, $2, $3, NOW() + INTERVAL '3 minutes')`,
      [
        challengeId,
        user.id,
        hashOtp(otpCode),
      ]
    );

    await client.query("COMMIT");

    // Send OTP email
    try {
      await sendOtpEmail({
        email: user.email,
        code: otpCode,
      });
    } catch (error) {
      await pool.query(
        "DELETE FROM otp_challenges WHERE id = $1",
        [challengeId]
      );

      console.error("Could not send OTP email:", error);

      return response.status(502).json({
        error: "Could not send OTP email",
      });
    }

    return response.json({
      requiresOtp: true,
      challengeId,
      email: maskEmail(user.email),
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(
      "Could not create authenticated session:",
      error
    );

    return response.status(500).json({
      error: "Could not create session",
    });
  } finally {
    client.release();
  }
});

// Verify OTP
app.post("/api/auth/otp/verify", async (request, response) => {
  const { challengeId, code } = request.body || {};

  if (
    typeof challengeId !== "string" ||
    typeof code !== "string" ||
    !/^\d{6}$/.test(code)
  ) {
    return response.status(400).json({
      error: "A valid OTP is required",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const challengeResult = await client.query(
      `SELECT
         c.id,
         c.user_id,
         c.code_hash,
         c.expires_at,
         c.attempts,
         c.consumed_at,
         u.email,
         u.display_name AS "name",
         u.avatar_url AS "avatarUrl"
       FROM otp_challenges c
       JOIN users u ON u.id = c.user_id
       WHERE c.id = $1
       FOR UPDATE`,
      [challengeId]
    );

    const challenge = challengeResult.rows[0];

    if (
      !challenge ||
      challenge.consumed_at ||
      new Date(challenge.expires_at) <= new Date() ||
      challenge.attempts >= maxOtpAttempts
    ) {
      await client.query("ROLLBACK");

      return response.status(400).json({
        error: "OTP is invalid or expired",
      });
    }

    if (hashOtp(code) !== challenge.code_hash) {
      await client.query(
        "UPDATE otp_challenges SET attempts = attempts + 1 WHERE id = $1",
        [challengeId]
      );

      await client.query("COMMIT");

      return response.status(401).json({
        error: "Incorrect OTP",
      });
    }

    await client.query(
      "UPDATE otp_challenges SET consumed_at = NOW() WHERE id = $1",
      [challengeId]
    );

    const rawToken = createSessionToken();

    await client.query(
      `INSERT INTO auth_sessions
        (token_hash, user_id, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '30 days')`,
      [
        hashToken(rawToken),
        challenge.user_id,
      ]
    );

    await client.query(
      `INSERT INTO login_events
        (user_id, provider, success, ip_address, user_agent)
       VALUES ($1, 'google+otp', TRUE, $2, $3)`,
      [
        challenge.user_id,
        getClientIp(request),
        request.get("user-agent") || null,
      ]
    );

    await client.query("COMMIT");

    response.setHeader(
      "Set-Cookie",
      `halal_session=${rawToken}; HttpOnly; ${
        isProduction ? "Secure; " : ""
      }SameSite=Lax; Path=/; Max-Age=2592000`
    );

    return response.json({
      user: {
        id: challenge.user_id,
        email: challenge.email,
        name: challenge.name,
        avatarUrl: challenge.avatarUrl,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Could not verify OTP:", error);

    return response.status(500).json({
      error: "Could not verify OTP",
    });
  } finally {
    client.release();
  }
});

// Get current user
app.get("/api/auth/me", (request, response) => {
  if (!request.user) {
    return response.status(401).json({
      error: "Not authenticated",
    });
  }

  return response.json({
    user: request.user,
  });
});

// Logout
app.post("/api/auth/logout", async (request, response) => {
  const token = getSessionToken(request);

  if (token) {
    await pool.query(
      "DELETE FROM auth_sessions WHERE token_hash = $1",
      [hashToken(token)]
    );
  }

  response.setHeader(
    "Set-Cookie",
    `halal_session=; HttpOnly; ${
      isProduction ? "Secure; " : ""
    }SameSite=Lax; Path=/; Max-Age=0`
  );

  return response.status(204).end();
});

// Error handler
app.use((error, _request, response, _next) => {
  console.error("Unhandled API error:", error);

  return response.status(500).json({
    error: "Internal server error",
  });
});

// Start server
app.listen(port, () => {
  console.log(
    `Halal Chiang Rai API listening on http://localhost:${port}`
  );
});