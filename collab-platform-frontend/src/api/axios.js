import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(config => {
  const stored = localStorage.getItem('collabUser')
  if (stored) {
    const parsed = JSON.parse(stored)
    if (parsed.token) {
      config.headers.Authorization = `Bearer ${parsed.token}`
    }
  }
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('collabUser')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
