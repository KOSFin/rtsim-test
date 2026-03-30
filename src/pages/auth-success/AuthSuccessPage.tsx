import { Link } from 'react-router-dom'
import { APP_ROUTES } from '../../app/routes'
import styles from './AuthSuccessPage.module.css'

export function AuthSuccessPage() {
  const logoSrc = `${import.meta.env.BASE_URL}favicon.ico`

  return (
    <main className={styles.page} aria-labelledby="auth-success-title">
      <section className={styles.content}>
        <img className={styles.logo} src={logoSrc} alt="Логотип приложения" />
        <h1 id="auth-success-title" className={styles.title}>
          Вход успешен
        </h1>
        <p className={styles.subtitle}>
          Вы успешно вошли в аккаунт. Это финальная страница-заглушка для задания.
        </p>

        <nav aria-label="Действия после входа">
          <Link className={styles.backLink} to={APP_ROUTES.authLogin}>
            Вернуться на вход
          </Link>
        </nav>
      </section>
    </main>
  )
}
