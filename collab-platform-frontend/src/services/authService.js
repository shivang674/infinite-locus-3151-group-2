import api from '../api/axios'

export async function loginUser(email, password) {
  const res = await api.post('/auth/login', { email, password })
  return res.data
}

export async function registerUser(fullName, email, password) {
  const res = await api.post('/auth/register', { fullName, email, password })
  return res.data
}
