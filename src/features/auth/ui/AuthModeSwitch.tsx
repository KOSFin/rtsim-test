import { Link } from 'react-router-dom'
import { APP_ROUTES } from '../../../app/routes'
import type { AuthMode } from '../model/authMode'
import styles from './AuthModeSwitch.module.css'

type AuthModeSwitchProps = {
  mode: AuthMode
}

export function AuthModeSwitch({ mode }: AuthModeSwitchProps) {
  const isLogin = mode === 'login'

  return (
    <p className={styles.switchText}>
      {isLogin ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
      <Link
        className={styles.link}
        to={isLogin ? APP_ROUTES.authRegister : APP_ROUTES.authLogin}
      >
        {isLogin ? 'Зарегистрироваться' : 'Войти'}
      </Link>
    </p>
  )
}
