import Contact from "../models/contact.model.js";

export const createContactDB = async (data) => {
  return await Contact.create(data);
};

export const getAllContactsDB = async () => {
  return await Contact.find().sort({ createdAt: -1 });
};