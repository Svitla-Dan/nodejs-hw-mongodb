import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

import { randomBytes } from 'crypto';
import { UsersCollection } from '../db/models/user.js';
import { SessionCollection } from '../db/models/session.js';
import {
  accessTokenLifetime,
  refreshTokenLifetime,
} from '../constants/users.js';
import { env } from '../utils/env.js';
import { sendEmail } from '../utils/sendMail.js';
import { TEMPLATES_DIR } from '../constants/email.js';

const createSessionData = () => ({
  accessToken: randomBytes(30).toString('base64'),
  refreshToken: randomBytes(30).toString('base64'),
  accessTokenValidUntil: Date.now() + accessTokenLifetime,
  refreshTokenValidUntil: Date.now() + refreshTokenLifetime,
});

export const register = async ({ email, password, ...rest }) => {
  const existingUser = await UsersCollection.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await UsersCollection.create({
    ...rest,
    email,
    password: hashedPassword,
  });

  return newUser;
};

export const login = async ({ email, password }) => {
  const user = await UsersCollection.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw createHttpError(401, 'Invalid email or password');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  return SessionCollection.create({
    userId: user._id,
    ...createSessionData(),
  });
};

export const refreshSession = async ({ sessionId, refreshToken }) => {
  const oldSession = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (!oldSession || new Date() > oldSession.refreshTokenValidUntil) {
    throw createHttpError(401, 'Invalid or expired refresh token');
  }

  await SessionCollection.deleteOne({ _id: sessionId });

  return SessionCollection.create({
    userId: oldSession.userId,
    ...createSessionData(),
  });
};

export const logout = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = await fs.readFile(resetPasswordTemplatePath, 'utf-8');

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  await sendEmail({
    from: env('SMTP_FROM'),
    to: email,
    subject: 'Reset your password',
    html,
  });
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, env('JWT_SECRET'));
  } catch (error) {
    if (error instanceof Error) throw createHttpError(401, error.message);
    throw error;
  }

  const user = await UsersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UsersCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};
