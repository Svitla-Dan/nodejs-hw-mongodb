import { createFakeContact } from '../utils/createFakeContact.js';
import { readContacts } from '../utils/readContacts.js';
import { writeContacts } from '../utils/writeContacts.js';

export const generateContacts = async (count) => {
  const contacts = await readContacts();
  const newContacts = Array.from({ length: count }, () => createFakeContact());
  await writeContacts([...contacts, ...newContacts]);
};

generateContacts(5);
