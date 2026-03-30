import { Navigate, useParams, useSearchParams } from 'react-router-dom'
import { APP_ROUTES } from '../../app/routes'
import { AuthForm } from '../../features/auth/ui/AuthForm'
import { useRef, useLayoutEffect, useState } from 'react'
import { AuthModeSwitch } from '../../features/auth/ui/AuthModeSwitch'
import { isAuthMode } from '../../features/auth/model/authMode'
import styles from './AuthPage.module.css'

export function AuthPage() {
  const { mode } = useParams<{ mode: string }>()
  const [searchParams] = useSearchParams()

  if (!isAuthMode(mode)) {
    return <Navigate to={APP_ROUTES.authLogin} replace />
  }

  const showRegistrationSuccessMessage =
    mode === 'login' && searchParams.get('registered') === '1'

  const formRef = useRef<HTMLDivElement>(null)
  const [formHeight, setFormHeight] = useState<number | undefined>(undefined)

  useLayoutEffect(() => {
    if (formRef.current) {
      setFormHeight(formRef.current.scrollHeight)
    }
  }, [mode])

  return (
    <main className={styles.page} aria-labelledby="auth-page-title">
      <section className={styles.card}>
        <h1 id="auth-page-title" className={styles.title}>
          {mode === 'login' ? 'Вход' : 'Регистрация'}
        </h1>
        <div
          className={styles.animatedForm}
          style={{ height: formHeight ? formHeight + 'px' : undefined }}
        >
          <div ref={formRef}>
            <AuthForm
              mode={mode}
              infoMessage={
                showRegistrationSuccessMessage
                  ? 'Регистрация прошла успешно. Теперь войдите в аккаунт.'
                  : undefined
              }
            />
          </div>
        </div>
        <AuthModeSwitch mode={mode} />
      </section>
    </main>
  )
}
