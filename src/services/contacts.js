import { ContactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export async function getContacts({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = 'asc',
  filter = {},
  userId,
}) {
  const skip = (page - 1) * perPage;
  const query = ContactsCollection.find({ userId });
  if (filter.contactType) {
    query.where('contactType').equals(filter.contactType);
  }
  if (typeof filter.isFavourite === 'boolean') {
    query.where('isFavourite').equals(filter.isFavourite);
  }

  const [totalItems, data] = await Promise.all([
    ContactsCollection.find().merge(query).countDocuments(),
    ContactsCollection.find()
      .merge(query)
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(totalItems, page, perPage);
  return {
    data,
    ...paginationData,
  };
}

export const getContactById = async ({ _id, userId }) => {
  const contact = await ContactsCollection.findOne({ _id, userId });
  return contact;
};

export const createContact = async (payload) => {
  const contact = await ContactsCollection.create(payload);
  return contact;
};

export const updateContact = async ({ _id, userId }, payload, options = {}) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id, userId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteContact = async ({ _id, userId }) => {
  const contact = await ContactsCollection.findOneAndDelete({ _id, userId });
  return contact;
};
