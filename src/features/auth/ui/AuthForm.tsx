import { Eye, EyeClosed } from 'lucide-react'
import { useState } from 'react'
import { FormField } from '../../../shared/ui/FormField/FormField'
import type { AuthMode } from '../model/authMode'
import { useAuthForm } from '../model/useAuthForm'
import { PasswordRequirements } from './PasswordRequirements'
import styles from './AuthForm.module.css'

type AuthFormProps = {
  mode: AuthMode
}

export function AuthForm({ mode }: AuthFormProps) {
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

  function renderPasswordToggle() {
    return (
      <button
        type="button"
        className={styles.passwordToggle}
        aria-label={togglePasswordLabel}
        title={togglePasswordLabel}
        onClick={() => setIsPasswordVisible((prev) => !prev)}
      >
        {isPasswordVisible ? <EyeClosed size={17} /> : <Eye size={17} />}
      </button>
    )
  }

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit}>
      <FormField
        id="email"
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        value={values.email}
        onChange={(event) => updateField('email', event.target.value)}
        invalid={Boolean(errors.email)}
      />

      <div className={styles.passwordGroup}>
        <FormField
          id="password"
          name="password"
          label="Пароль"
          type={passwordType}
          attachedBottom={mode === 'register'}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          value={values.password}
          onChange={(event) => updateField('password', event.target.value)}
          invalid={Boolean(errors.password)}
          endAdornment={renderPasswordToggle()}
        />

        {mode === 'register' ? <PasswordRequirements password={values.password} /> : null}
      </div>

      {mode === 'register' ? (
        <FormField
          id="confirm-password"
          name="confirmPassword"
          label="Подтверждение пароля"
          type={passwordType}
          autoComplete="new-password"
          value={values.confirmPassword}
          onChange={(event) => updateField('confirmPassword', event.target.value)}
          invalid={Boolean(errors.confirmPassword)}
          endAdornment={renderPasswordToggle()}
        />
      ) : null}

      {validationMessage ? (
        <p className={styles.validationMessage} role="alert">
          {validationMessage}
        </p>
      ) : null}

      {serverError ? (
        <p className={styles.serverError} role="alert">
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
