import express from 'express';
import cors from 'cors';

import contactsRouter from './routers/contacts.js';
import { env } from './utils/env.js';
import { logger } from './middlewares/logger.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const PORT = Number(env('PORT', 3000));

export const startServer = () => {
  const app = express();

  app.use(logger);
  app.use(express.json());
  app.use(cors());
  app.use('/contacts', contactsRouter);
  app.use('*', notFoundHandler);
  app.use(errorHandler);
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
