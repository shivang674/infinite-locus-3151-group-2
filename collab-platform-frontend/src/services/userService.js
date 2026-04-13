import api from '../api/axios'

export async function searchUsers(query) {
  const res = await api.get(`/users/search?q=${encodeURIComponent(query)}`)
  return res.data
}
