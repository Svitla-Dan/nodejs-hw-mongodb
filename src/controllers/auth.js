import * as authServices from '../services/auth.js';

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
};

export const registerController = async (req, res, next) => {
  try {
    const data = await authServices.register(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const session = await authServices.login(req.body);
    setupSession(res, session);
    res.status(200).json({
      status: 200,
      message: 'Successfully logged in!',
      data: { accessToken: session.accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshSessionController = async (req, res, next) => {
  try {
    const session = await authServices.refreshSession(req.cookies);
    setupSession(res, session);
    res.status(200).json({
      status: 200,
      message: 'Session refreshed successfully!',
      data: { accessToken: session.accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (req, res, next) => {
  try {
    await authServices.logout(req.cookies.sessionId);
    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
