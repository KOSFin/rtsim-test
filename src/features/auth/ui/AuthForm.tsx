import { Eye, EyeClosed } from 'lucide-react'
import { useState } from 'react'
import { FormField } from '../../../shared/ui/FormField/FormField'
import type { AuthMode } from '../model/authMode'
import { useAuthForm } from '../model/useAuthForm'
import { PasswordRequirements } from './PasswordRequirements'
import styles from './AuthForm.module.css'

type AuthFormProps = {
  mode: AuthMode
  infoMessage?: string
}

export function AuthForm({ mode, infoMessage }: AuthFormProps) {
  const infoMessageId = 'auth-info-message'
  const validationMessageId = 'auth-validation-message'
  const serverErrorId = 'auth-server-error'
  const passwordRequirementsId = 'password-requirements'
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const {
    values,
    errors,
    validationMessage,
    serverError,
    isSubmitting,
    submitLabel,
    updateField,
    handleSubmit,
  } = useAuthForm(mode)
  const passwordType = isPasswordVisible ? 'text' : 'password'
  const togglePasswordLabel = isPasswordVisible
    ? 'Скрыть пароль'
    : 'Показать пароль'

  function togglePasswordVisibility() {
    const activeElement = document.activeElement
    const isPasswordInputFocused =
      activeElement instanceof HTMLInputElement &&
      (activeElement.id === 'password' || activeElement.id === 'confirm-password')

    const selectionStart = isPasswordInputFocused ? activeElement.selectionStart : null
    const selectionEnd = isPasswordInputFocused ? activeElement.selectionEnd : null

    setIsPasswordVisible((prev) => !prev)

    if (!isPasswordInputFocused) {
      return
    }

    requestAnimationFrame(() => {
      activeElement.focus({ preventScroll: true })

      if (selectionStart !== null && selectionEnd !== null) {
        activeElement.setSelectionRange(selectionStart, selectionEnd)
      }
    })
  }

  function renderPasswordToggle() {
    return (
      <button
        type="button"
        className={styles.passwordToggle}
        aria-label={togglePasswordLabel}
        aria-pressed={isPasswordVisible}
        aria-controls={mode === 'register' ? 'password confirm-password' : 'password'}
        title={togglePasswordLabel}
        onMouseDown={(event) => event.preventDefault()}
        onClick={togglePasswordVisibility}
      >
        {isPasswordVisible ? <EyeClosed size={17} /> : <Eye size={17} />}
      </button>
    )
  }

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit} aria-busy={isSubmitting}>
      {infoMessage ? (
        <p id={infoMessageId} className={styles.infoMessage} role="status">
          {infoMessage}
        </p>
      ) : null}

      <FormField
        id="email"
        name="email"
        label="Email"
        type="email"
        inputMode="email"
        required
        autoComplete="email"
        value={values.email}
        onChange={(event) => updateField('email', event.target.value)}
        invalid={Boolean(errors.email)}
        aria-describedby={infoMessage ? infoMessageId : undefined}
      />

      <div className={styles.passwordGroup}>
        <FormField
          id="password"
          name="password"
          label="Пароль"
          type={passwordType}
          required
          attachedBottom={mode === 'register'}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          value={values.password}
          onChange={(event) => updateField('password', event.target.value)}
          invalid={Boolean(errors.password)}
          aria-describedby={mode === 'register' ? passwordRequirementsId : undefined}
          endAdornment={renderPasswordToggle()}
        />

        {mode === 'register' ? (
          <PasswordRequirements id={passwordRequirementsId} password={values.password} />
        ) : null}
      </div>

      {mode === 'register' ? (
        <FormField
          id="confirm-password"
          name="confirmPassword"
          label="Подтверждение пароля"
          type={passwordType}
          required
          autoComplete="new-password"
          value={values.confirmPassword}
          onChange={(event) => updateField('confirmPassword', event.target.value)}
          invalid={Boolean(errors.confirmPassword)}
          aria-describedby={passwordRequirementsId}
          endAdornment={renderPasswordToggle()}
        />
      ) : null}

      {validationMessage ? (
        <p id={validationMessageId} className={styles.validationMessage} role="alert">
          {validationMessage}
        </p>
      ) : null}

      {serverError ? (
        <p id={serverErrorId} className={styles.serverError} role="alert">
          {serverError}
        </p>
      ) : null}

      <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <span className={styles.loadingWrap}>
            <span className={styles.loadingDot} aria-hidden="true" />
            Отправка
          </span>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  )
}
