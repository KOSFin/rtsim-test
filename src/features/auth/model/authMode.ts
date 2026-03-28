export const AUTH_MODES = ['login', 'register'] as const

export type AuthMode = (typeof AUTH_MODES)[number]

export function isAuthMode(value: string | undefined): value is AuthMode {
  return Boolean(value) && AUTH_MODES.includes(value as AuthMode)
}
