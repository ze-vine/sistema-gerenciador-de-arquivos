import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoutes.tsx';
import { PublicRoutes } from './components/PublicRoutes.tsx';

import AuthProvider from './context/AuthProvider.tsx';
import LoginPage from './pages/LoginPage.tsx';
import Dashboard from './pages/Dashboard.tsx';

import "./index.css";

function Root() {
  return (
    <StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<PublicRoutes />} >
              <Route element={<LoginPage />} path="/login" />
            </Route>
            <Route element={<ProtectedRoute />} >
              <Route element={<Dashboard />} path="/" />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<Root />)