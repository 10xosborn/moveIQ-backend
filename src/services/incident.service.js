export const markStillThere = async (incidentId) => {
  return { message: `Incident ${incidentId} marked as still there` }
}

export const markCleared = async (incidentId) => {
  return { message: `Incident ${incidentId} marked as cleared` }
}

export const upvote = async (incidentId) => {
  return { message: `Upvoted incident ${incidentId}` }
}

export const downvote = async (incidentId) => {
  return { message: `Downvoted incident ${incidentId}` }
}

export const addComment = async (incidentId, comment) => {
  return { message: `Comment added`, incidentId, comment }
}

export const getComments = async (incidentId) => {
  return { message: `Comments for incident ${incidentId}` }
}

export const deleteComment = async (commentId) => {
  return { message: `Deleted comment ${commentId}` }
}