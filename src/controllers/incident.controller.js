import * as incidentService from "../services/incident.service.js"

export const markIncidentStillThere = async (req, res) => {
  const { id } = req.params
  const result = await incidentService.markStillThere(id)

  res.json(result)
}

export const markIncidentCleared = async (req, res) => {
  const { id } = req.params
  const result = await incidentService.markCleared(id)

  res.json(result)
}

export const upvoteIncident = async (req, res) => {
  const { id } = req.params
  const result = await incidentService.upvote(id)

  res.json(result)
}

export const downvoteIncident = async (req, res) => {
  const { id } = req.params
  const result = await incidentService.downvote(id)

  res.json(result)
}

export const addIncidentComment = async (req, res) => {
  const { id } = req.params
  const { comment } = req.body

  const result = await incidentService.addComment(id, comment)

  res.json(result)
}

export const getIncidentComments = async (req, res) => {
  const { id } = req.params

  const result = await incidentService.getComments(id)

  res.json(result)
}

export const deleteIncidentComment = async (req, res) => {
  const { commentId } = req.params

  const result = await incidentService.deleteComment(commentId)

  res.json(result)
}