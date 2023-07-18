import fs from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';

const contactsPath = path.resolve('models', 'contacts.json');

export async function listContacts() {
  const data = await fs.readFile(contactsPath, 'utf-8');
  return JSON.parse(data);
}

export async function getContactById(contactId) {
  const contacts = await listContacts();
  const result = contacts.find(item => item.id === contactId);
  return result || null;
}

export async function removeContact(contactId) {
  const contacts = await listContacts();
  const removedContactIndex = contacts.findIndex(item => item.id === contactId);
  if (removedContactIndex === -1) {
    return null;
  }
  const [result] = contacts.splice(removedContactIndex, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return result;
}

export async function addContact({ name, email, phone }) {
  const contacts = await listContacts();
  const newContact = { name, email, phone, id: nanoid() };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

export async function updateContact(contactId, { name, email, phone }) {
  const contacts = await listContacts();
  const index = contacts.findIndex(el => el.id === contactId);

  if (index === -1) {
    return null;
  }
  contacts[index] = { name, email, phone, id: contactId };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[index];
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
