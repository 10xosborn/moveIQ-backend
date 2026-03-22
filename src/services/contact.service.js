import { createContactDB } from "../database/contact.database.js";

export const createContactService = async (data) => {
  return await createContactDB(data);
};