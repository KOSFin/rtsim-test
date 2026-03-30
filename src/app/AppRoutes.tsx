import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthPage } from '../pages/auth/AuthPage'
import { AuthSuccessPage } from '../pages/auth-success/AuthSuccessPage'
import { APP_ROUTES } from './routes'

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path={APP_ROUTES.root}
        element={<Navigate to={APP_ROUTES.authLogin} replace />}
      />
      <Route path={APP_ROUTES.authSuccess} element={<AuthSuccessPage />} />
      <Route path={APP_ROUTES.auth} element={<AuthPage />} />
      <Route path="*" element={<Navigate to={APP_ROUTES.authLogin} replace />} />
    </Routes>
  )
}
