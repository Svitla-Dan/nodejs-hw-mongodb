import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';

import { getAllContacts, getContactById } from './services/contacts.js';

const PORT = Number(env('PORT', '3000'));

export const startServer = () => {
  const app = express();

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(express.json());
  app.use(cors());

  app.get('/contacts', async (req, res, next) => {
    try {
      const contacts = await getAllContacts();
      if (contacts.length === 0) {
        res.status(404).json({
          status: 404,
          message: 'Contacts not found',
          error: 'Contact database is empty',
        });
        return;
      }
      res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
      });
    } catch (err) {
      next(err);
    }
  });

  app.get('/contacts/:contactId', async (req, res, next) => {
    try {
      const { contactId } = req.params;
      const contact = await getContactById(contactId);
      if (!contact) {
        res.status(404).json({
          status: 404,
          message: 'Contact not found',
          error: `Contact with id=${contactId} not found`,
        });
        return;
      }
      res.status(200).json({
        status: 200,
        message: `Contact successfully found`,
        data: contact,
      });
    } catch (err) {
      next(err);
    }
  });

  app.use('*', (req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
