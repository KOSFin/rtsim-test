import { useState, type FormEvent } from 'react'
import { login, register } from '../../../entities/auth/api/authApi'
import { HttpError } from '../../../shared/api/httpClient'
import type { AuthMode } from './authMode'
import {
  INITIAL_AUTH_VALUES,
  validateAuthForm,
  type AuthFormErrors,
  type AuthFormValues,
} from './validation'

type ValidationQueueItem = {
  field: keyof AuthFormValues
  message: string
}

const VALIDATION_ORDER: Array<keyof AuthFormValues> = [
  'email',
  'password',
  'confirmPassword',
]

function buildValidationQueue(errors: AuthFormErrors): ValidationQueueItem[] {
  return VALIDATION_ORDER.flatMap((field) => {
    const message = errors[field]

    if (!message) {
      return []
    }

    return [{ field, message }]
  })
}

function getServerErrorMessage(error: unknown): string {
  if (error instanceof HttpError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Не удалось отправить форму. Попробуй еще раз.'
}

export function useAuthForm(mode: AuthMode) {
  const [values, setValues] = useState<AuthFormValues>(INITIAL_AUTH_VALUES)
  const [errors, setErrors] = useState<AuthFormErrors>({})
  const [validationMessage, setValidationMessage] = useState<string>('')
  const [serverError, setServerError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationSignature, setValidationSignature] = useState('')
  const [validationStep, setValidationStep] = useState(0)

  const submitLabel = mode === 'login' ? 'Войти' : 'Зарегистрироваться'

  function updateField(field: keyof AuthFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
    setServerError('')
    setValidationMessage('')
    setErrors({})
    setValidationSignature('')
    setValidationStep(0)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedValues: AuthFormValues = {
      ...values,
      email: values.email.trim(),
    }
    const validationErrors = validateAuthForm(normalizedValues, mode)
    const validationQueue = buildValidationQueue(validationErrors)

    setValues(normalizedValues)
    setErrors({})
    setServerError('')
    setValidationMessage('')

    if (validationQueue.length > 0) {
      const nextSignature = validationQueue
        .map((item) => `${item.field}:${item.message}`)
        .join('|')
      const nextStep =
        nextSignature === validationSignature
          ? Math.min(validationStep + 1, validationQueue.length - 1)
          : 0
      const currentValidationError = validationQueue[nextStep]

      setValidationSignature(nextSignature)
      setValidationStep(nextStep)
      setErrors({
        [currentValidationError.field]: currentValidationError.message,
      })
      setValidationMessage(currentValidationError.message)

      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        email: normalizedValues.email,
        password: normalizedValues.password,
      }

      if (mode === 'login') {
        await login(payload)
      } else {
        await register(payload)
      }

      setErrors({})
      setValidationMessage('')
      setValidationSignature('')
      setValidationStep(0)
      setValues(INITIAL_AUTH_VALUES)
    } catch (error) {
      setServerError(getServerErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    values,
    errors,
    validationMessage,
    serverError,
    isSubmitting,
    submitLabel,
    updateField,
    handleSubmit,
  }
}
