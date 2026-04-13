import api from '../api/axios'

export async function fetchDocuments() {
  const res = await api.get('/documents')
  return res.data
}

export async function fetchDocument(id) {
  const res = await api.get(`/documents/${id}`)
  return res.data
}

export async function createDocument(title, content) {
  const res = await api.post('/documents', { title, content })
  return res.data
}

export async function updateDocument(id, content) {
  const res = await api.put(`/documents/${id}`, { content })
  return res.data
}

export async function deleteDocument(id) {
  await api.delete(`/documents/${id}`)
}

export async function fetchVersions(docId) {
  const res = await api.get(`/documents/${docId}/versions`)
  return res.data
}

export async function revertToVersion(docId, versionId) {
  const res = await api.post(`/documents/${docId}/revert/${versionId}`)
  return res.data
}

export async function addCollaborator(docId, email) {
  await api.post(`/documents/${docId}/collaborators`, { email })
}

export async function fetchCollaborators(docId) {
  const res = await api.get(`/documents/${docId}/collaborators`)
  return res.data
}
