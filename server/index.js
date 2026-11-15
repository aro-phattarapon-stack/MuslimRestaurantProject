
import nodemailer from "nodemailer";
import "dotenv/config";

import crypto from "node:crypto";
import express from "express";
import helmet from "helmet";
import { OAuth2Client } from "google-auth-library";
import pg from "pg";

const { Pool } = pg;
const app = express();
const port = Number(process.env.PORT || 3001);

const maxOtpAttempts = 5;
const isProduction = process.env.NODE_ENV === "production";

// Check required environment variables
if (
  !process.env.DATABASE_URL ||
  !process.env.GOOGLE_CLIENT_ID ||
  !process.env.SESSION_SECRET ||
  !process.env.SMTP_USER ||
  !process.env.SMTP_APP_PASSWORD
) {
  throw new Error(
    "DATABASE_URL, GOOGLE_CLIENT_ID, SESSION_SECRET, SMTP_USER, and SMTP_APP_PASSWORD are required"
  );
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

// Gmail SMTP transporter
const mailTransporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_APP_PASSWORD,
  },
});

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

// Send OTP email using Gmail
async function sendOtpEmail({ email, code }) {
  await mailTransporter.sendMail({
    from: {
      name: "Halal Chiang Rai",
      address: process.env.SMTP_USER,
    },
    to: email,
    subject: "Your Halal Chiang Rai verification code",
    text: `
Hello,

You requested a verification code to sign in to Halal Chiang Rai.

Your verification code is: ${code}

This code expires in 3 minutes and can only be used once.

If you did not request this code, please ignore this email.

Thank you,
Halal Chiang Rai Team
    `.trim(),
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0; padding:24px; background:#f5f5f5; font-family:Arial,sans-serif;">
          <div style="max-width:480px; margin:auto; padding:28px; background:#ffffff; border-radius:12px;">
            <h2 style="color:#166534; text-align:center;">
              Halal Chiang Rai
            </h2>

            <p>Hello,</p>

            <p>
              You requested a verification code to sign in to
              Halal Chiang Rai.
            </p>

            <div style="margin:24px 0; padding:20px; background:#f3f4f6; text-align:center; border-radius:8px;">
              <p style="margin:0 0 10px; color:#555;">
                Your verification code
              </p>

              <h1 style="margin:0; color:#166534; letter-spacing:8px;">
                ${code}
              </h1>
            </div>

            <p>
              This code expires in <strong>3 minutes</strong>
              and can only be used once.
            </p>

            <p>
              If you did not request this code, please ignore this email.
            </p>

            <p style="margin-top:28px;">
              Thank you,<br />
              <strong>Halal Chiang Rai Team</strong>
            </p>
          </div>
        </body>
      </html>
    `,
  });
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
