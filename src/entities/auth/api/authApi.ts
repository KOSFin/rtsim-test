import { HttpError, post } from '../../../shared/api/httpClient'
import { API_CONFIG, API_ENDPOINTS } from '../../../shared/config/api'
import type { AuthPayload, AuthResponse } from '../model/types'

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function mockAuth(payload: AuthPayload, mode: 'login' | 'register') {
  await sleep(1000)

  if (mode === 'register' && payload.email.endsWith('@exists.test')) {
    throw new HttpError('Пользователь с таким email уже существует', 409)
  }

  if (mode === 'login' && payload.email === 'blocked@rtsim.ru') {
    throw new HttpError('Пользователь заблокирован', 403)
  }

  return {
    accessToken: 'mock-access-token',
    user: {
      id: crypto.randomUUID(),
      email: payload.email,
    },
  } satisfies AuthResponse
}

export function login(payload: AuthPayload): Promise<AuthResponse> {
  if (API_CONFIG.useMockApi) {
    return mockAuth(payload, 'login')
  }

  return post<AuthResponse, AuthPayload>(API_ENDPOINTS.auth.login, payload)
}

export function register(payload: AuthPayload): Promise<AuthResponse> {
  if (API_CONFIG.useMockApi) {
    return mockAuth(payload, 'register')
  }

  return post<AuthResponse, AuthPayload>(API_ENDPOINTS.auth.register, payload)
}
