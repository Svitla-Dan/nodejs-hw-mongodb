import createHttpError from 'http-errors';
import * as contactServices from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseContactFilterParams } from '../utils/parseContactFilterParams.js';
import { sortByList } from '../db/models/contacts.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const getContactsController = async (req, res, next) => {
  try {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query, sortByList);
    const filter = parseContactFilterParams(req.query);
    const contacts = await contactServices.getContacts({
      page,
      perPage,
      sortBy,
      sortOrder,
      filter,
      userId: req.user._id,
    });
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await contactServices.getContactById({
      _id: contactId,
      userId: req.user._id,
    });
    if (!contact) {
      throw createHttpError(404, `Contact with id ${contactId} was not found`);
    }
    res.status(200).json({
      status: 200,
      message: `Contact successfully found with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const createContactController = async (req, res, next) => {
  try {
      const photo = req.file;
      let photoUrl;
      if (photo) {
        photoUrl = await saveFileToCloudinary(photo);
      }
    const contact = await contactServices.createContact({
      ...req.body,
      photo: photoUrl,
      userId: req.user._id,
    });
    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const photo = req.file;
    let photoUrl;
    if (photo) {
      photoUrl = await saveFileToCloudinary(photo);
    }
    const result = await contactServices.updateContact(
      { _id: contactId, userId: req.user._id },
      {
        ...req.body,
        photo: photoUrl,
      },
    );
    if (!result) {
      throw createHttpError(404, `Contact with id ${contactId} was not found`);
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully updated a contact!',
      data: result.contact,
    });
  } catch (error) {
    next(error);
  }
};

export const upsertContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const photo = req.file;
    let photoUrl;
    if (photo) {
      photoUrl = await saveFileToCloudinary(photo);
    }
    const result = await contactServices.updateContact(
      { _id: contactId, userId: req.user._id },
      {
        ...req.body,
        photo: photoUrl,
      },
      { upsert: true },
    );
    if (!result) {
      next(createHttpError(404, `Contact with id ${contactId} was not found`));
      return;
    }
    const status = result.isNew ? 201 : 200;
    res.status(status).json({
      status,
      message: 'Successfully upserted a contact!',
      data: result.contact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contactServices.deleteContact({
      _id: contactId,
      userId: req.user._id,
    });

    if (!result) {
      throw createHttpError(404, `Contact with id ${contactId} was not found`);
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
