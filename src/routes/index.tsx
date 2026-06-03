import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth.context';
import { LoginPage } from '../pages/login';
import { DashboardPage } from '../pages/dashboard';
import { CategoriasPage } from '../pages/categorias';
import { TransacoesPage } from '../pages/transacoes';
import { CultosPage } from '../pages/cultos';
import { CultoDetalhePage } from '../pages/culto-detalhe';

export function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          !isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />
        }
      />
      <Route
        path="/dashboard"
        element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />}
      />
      <Route
        path="/categorias"
        element={
          isAuthenticated ? <CategoriasPage /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/transacoes"
        element={
          isAuthenticated ? <TransacoesPage /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/cultos"
        element={isAuthenticated ? <CultosPage /> : <Navigate to="/login" />}
      />
      <Route
        path="/cultos/:id"
        element={
          isAuthenticated ? <CultoDetalhePage /> : <Navigate to="/login" />
        }
      />
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />}
      />
    </Routes>
  );
}
