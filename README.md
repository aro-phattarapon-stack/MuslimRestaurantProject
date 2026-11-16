# Halal Chiang Rai

A mobile-first React application for discovering halal restaurants in Chiang Rai, Thailand.

## Requirements

- Node.js 18 or newer
- npm

## Install

Run these commands from the project folder (the folder containing `package.json`):

```powershell
npm ci
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
```

Open `.env` and configure the values for the services you want to use:

- For Gemini recommendations, set `GEMINI_API_KEY` using a key from [Google AI Studio](https://aistudio.google.com/api-keys). Keep it private; it is read only by the server. Recommendations use `gemini-4-argon` by default; change `GEMINI_MODEL` if you want to select another model enabled for your API key.
- For Google sign-in, create an OAuth 2.0 **Web application** client in [Google Cloud Console](https://console.cloud.google.com/apis/credentials). Add `http://localhost:5173` and your deployed website origin to **Authorized JavaScript origins**. Set the same client ID as both `GOOGLE_CLIENT_ID` and `VITE_GOOGLE_CLIENT_ID`.
- For local OTP testing with Mailpit, start Mailpit and set `EMAIL_PROVIDER=mailpit`, `MAILPIT_HOST=127.0.0.1`, `MAILPIT_PORT=1025`, and `MAIL_FROM_EMAIL=Halal Chiang Rai <otp@example.test>`. Open `http://localhost:8025` to view captured emails. No email is delivered to real inboxes in this mode.
- To send real OTP emails, set `EMAIL_PROVIDER=resend`, create a [Resend](https://resend.com/api-keys) API key, verify the sender's domain in Resend, and set `RESEND_API_KEY` and `RESEND_FROM_EMAIL` (for example, `Halal Chiang Rai <auth@your-verified-domain.com>`). Resend's `onboarding@resend.dev` sender is for testing and can only send to the email address associated with your Resend account. Do not expose the Resend API key in a `VITE_` variable.
- Google authentication also requires a PostgreSQL database and a `SESSION_SECRET` of at least 32 characters. Create the database tables by running `server/schema.sql` against that database.

## Run

Start the API server in one terminal:

```powershell
npm run server
```

Start the website in a second terminal:

```powershell
npm run dev
```

Open the URL Vite prints, usually `http://localhost:5173/`.

The Gemini recommendation uses the configured model's free tier, which has usage limits and may change. Prompts are sent to Google for processing; do not enter sensitive personal information. If the API key is missing, Gemini is unavailable, or its quota is exhausted, the app clearly reports the issue and uses local filters instead. Restaurant filtering and search results update locally as you change the search text or filters.

The authentication API is optional for local restaurant search and Gemini. Google sign-in and OTP are enabled only when the database, Google OAuth client, and session secret are configured, along with settings for the selected email provider.
