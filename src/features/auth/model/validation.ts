import type { AuthMode } from './authMode'

const EMAIL_RULE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const LOWERCASE_RULE = /[a-z]/
const UPPERCASE_RULE = /[A-Z]/
const DIGIT_RULE = /\d/
const SPECIAL_RULE = /[^A-Za-z\d]/

export type PasswordRequirementKey =
  | 'length'
  | 'lowercase'
  | 'uppercase'
  | 'digit'
  | 'special'
  | 'noSpaces'

export type PasswordRequirementState = {
  key: PasswordRequirementKey
  label: string
  isPassed: boolean
}

export type AuthFormValues = {
  email: string
  password: string
  confirmPassword: string
}

export type AuthFormErrors = Partial<Record<keyof AuthFormValues, string>>

export const INITIAL_AUTH_VALUES: AuthFormValues = {
  email: '',
  password: '',
  confirmPassword: '',
}

export function validateEmail(emailValue: string): string | undefined {
  const email = emailValue.trim()

  if (!email) {
    return 'Укажите email'
  }

  if (email.length > 254) {
    return 'Email слишком длинный'
  }

  if (!EMAIL_RULE.test(email)) {
    return 'Некорректный формат email'
  }

  return undefined
}

export function getPasswordRequirementStates(
  password: string,
): PasswordRequirementState[] {
  return [
    {
      key: 'length',
      label: 'От 8 до 64 символов',
      isPassed: password.length >= 8 && password.length <= 64,
    },
    {
      key: 'lowercase',
      label: 'Минимум одна строчная буква',
      isPassed: LOWERCASE_RULE.test(password),
    },
    {
      key: 'uppercase',
      label: 'Минимум одна заглавная буква',
      isPassed: UPPERCASE_RULE.test(password),
    },
    {
      key: 'digit',
      label: 'Минимум одна цифра',
      isPassed: DIGIT_RULE.test(password),
    },
    {
      key: 'special',
      label: 'Минимум один спецсимвол',
      isPassed: SPECIAL_RULE.test(password),
    },
    {
      key: 'noSpaces',
      label: 'Без пробелов',
      isPassed: !/\s/.test(password),
    },
  ]
}

function hasAllPasswordRequirements(password: string): boolean {
  return getPasswordRequirementStates(password).every((item) => item.isPassed)
}

function validatePasswordForMode(
  password: string,
  mode: AuthMode,
): string | undefined {
  if (!password) {
    return 'Укажите пароль'
  }

  if (password.length > 64) {
    return 'Максимум 64 символа'
  }

  if (mode !== 'register') {
    return undefined
  }

  if (!hasAllPasswordRequirements(password)) {
    return 'Не выполнены требования к паролю'
  }

  return undefined
}

export function validateConfirmPasswordExact(
  password: string,
  confirmPassword: string,
): string | undefined {
  if (!confirmPassword) {
    return 'Подтверди пароль'
  }

  if (confirmPassword !== password) {
    return 'Пароли не совпадают'
  }

  return undefined
}

export function validateAuthForm(
  values: AuthFormValues,
  mode: AuthMode,
): AuthFormErrors {
  const errors: AuthFormErrors = {}
  const emailError = validateEmail(values.email)
  const passwordError = validatePasswordForMode(values.password, mode)

  if (emailError) {
    errors.email = emailError
  }

  if (passwordError) {
    errors.password = passwordError
  }

  if (mode === 'register') {
    const confirmPasswordError = validateConfirmPasswordExact(
      values.password,
      values.confirmPassword,
    )

    if (confirmPasswordError) {
      errors.confirmPassword = confirmPasswordError
    }
  }

  return errors
}
