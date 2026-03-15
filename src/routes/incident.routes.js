import express from "express"
import {
  markIncidentStillThere,
  markIncidentCleared,
  upvoteIncident,
  downvoteIncident,
  addIncidentComment,
  getIncidentComments,
  deleteIncidentComment
} from "../controllers/incident.controller.js"

const router = express.Router()

router.patch("/:id/still-there", markIncidentStillThere)
router.patch("/:id/cleared", markIncidentCleared)

router.post("/:id/upvote", upvoteIncident)
router.post("/:id/downvote", downvoteIncident)

router.post("/:id/comment", addIncidentComment)
router.get("/:id/comments", getIncidentComments)
router.delete("/comment/:commentId", deleteIncidentComment)

export default router