import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Menu from './Menu';
import { logout } from '../services/auth';

const MainScreen = ({ setAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Remove o token do localStorage
    setAuthenticated(false); // Atualiza o estado de autenticação
    navigate('/login'); // Redireciona para a página de login
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
        <h1>Bem-vindo ao Sistema</h1>
        <button onClick={handleLogout} style={{ padding: '5px 10px' }}>
          Sair
        </button>
      </div>
      <Menu />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/categories" element={<h2>Página de Categorias</h2>} />
          <Route path="/products" element={<h2>Página de Produtos</h2>} />
          <Route path="/sales" element={<h2>Página de Vendas</h2>} />
          <Route path="/" element={<p>Selecione uma opção no menu acima.</p>} />
        </Routes>
      </div>
    </div>
  );
};

export default MainScreen;