import express from "express";
import { createContact } from "../controllers/contact.controller.js";
import { contactValidator } from "../validators/contact.validator.js";

const router = express.Router();

router.post("/", contactValidator, createContact);

export default router;