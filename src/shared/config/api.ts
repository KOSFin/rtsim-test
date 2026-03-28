export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  useMockApi: import.meta.env.VITE_USE_MOCK_API !== 'false',
} as const

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
  },
} as const
