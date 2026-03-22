import { validationResult } from "express-validator";
import { createContactService } from "../services/contact.service.js";

export const createContact = async (req, res) => {
  try {
    // validation check
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { firstName, lastName, email, phone, message } = req.body;

    const contact = await createContactService({
      firstName,
      lastName,
      email,
      phone,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: { contact },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};