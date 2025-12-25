import express from 'express';
import axios from 'axios';
import qs from 'querystring';

const router = express.Router();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'YOUR_CLIENT_ID';
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'YOUR_CLIENT_SECRET';
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback';
const SCOPE = 'https://www.googleapis.com/auth/youtube.readonly profile email';

// Step 1: Redirect user to Google OAuth consent screen
router.get('/auth/google', (req, res) => {
  const params = qs.stringify({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: SCOPE,
    access_type: 'offline',
    prompt: 'consent',
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

// Step 2: Handle OAuth callback and exchange code for tokens
router.get('/auth/google/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('Missing code');
  try {
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', qs.stringify({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    // You get access_token, refresh_token, etc.
    // Store tokens in session/db as needed
    res.json(tokenRes.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
