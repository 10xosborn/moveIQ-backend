import Joi from "joi";
import { INCIDENT_TYPES } from "../utils/constants.js";

export const createIncidentSchema = Joi.object({
  type: Joi.string()
    .valid(...INCIDENT_TYPES)
    .required(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  route: Joi.string().optional(),
});

export const updateIncidentSchema = Joi.object({
  type: Joi.string().valid(...INCIDENT_TYPES),
  latitude: Joi.number(),
  longitude: Joi.number(),
  route: Joi.string(),
}).min(1);

export const addCommentSchema = Joi.object({
  text: Joi.string().trim().required(),
});
