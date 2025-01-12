import { OAuth2Client } from 'google-auth-library';
import createHttpError from 'http-errors';
import { env } from './env.js';

const clientId = env('GOOGLE_AUTH_CLIENT_ID');
const clientSecret = env('GOOGLE_AUTH_CLIENT_SECRET');

const googleOAuthClient = new OAuth2Client({
  clientId,
  clientSecret,
  redirectUri: `${env('APP_DOMAIN')}/confirm-google-auth`,
});

export const generateAuthUrl = () =>
  googleOAuthClient.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });

export const validateCode = async (code) => {
  try {
    const response = await googleOAuthClient.getToken(code);
    if (!response.tokens.id_token) {
      throw createHttpError(401, 'Invalid Google authentication token.');
    }
    const ticket = await googleOAuthClient.verifyIdToken({
      idToken: response.tokens.id_token,
    });
    return ticket;
  } catch (error) {
    throw createHttpError(
      401,
      `Google OAuth validation failed: ${error.message}`,
    );
  }
};

export const getFullNameFromGoogleTokenPayload = (payload) => {
  if (payload.name) {
    return payload.name;
  }

  const firstName = payload.given_name || '';
  const lastName = payload.family_name || '';
  return firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Guest';
};
