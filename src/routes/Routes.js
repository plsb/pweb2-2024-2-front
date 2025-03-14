import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from '../components/Login';
import MainScreen from '../components/MainScreen';
import UsersList from '../components/UsersList';
import CategoriesList from '../components/CategoriesList';
import ProductsList from '../components/ProductsList';
import SalesList from '../components/SalesList';

const Layout = ({ children, setAuthenticated }) => {
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove o token
    setAuthenticated(false);
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#f8f8f8' }}>
        <h1>Bem-vindo ao Sistema</h1>
        <button onClick={handleLogout} style={{ padding: '5px 10px' }}>
          Sair
        </button>
      </header>
      <main style={{ padding: '20px' }}>
        {children}
      </main>
    </div>
  );
};

const AppRoutes = ({ isAuthenticated, setAuthenticated }) => {
  const handleLogin = () => {
    setAuthenticated(true);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Rota de Login */}
        <Route
          path="/login"
          element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/" />}
        />

        {/* Rotas autenticadas com Layout */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Layout setAuthenticated={setAuthenticated}>
                <MainScreen setAuthenticated={setAuthenticated} />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          {/* As rotas como /users, /categories, etc., estão aninhadas dentro da rota raiz / no MainScreen, usando o Outlet para renderizar o conteúdo. */}
          <Route index element={<p>Selecione uma opção no menu acima.</p>} />
          <Route path="users" element={<UsersList />} />
          <Route path="categories" element={<CategoriesList />} />
          <Route path="products" element={<ProductsList />} />
          <Route path="sales" element={<SalesList />} />
        </Route>

        {/* Rotas inválidas redirecionam para / (se autenticado) ou /login (se não autenticado). */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;