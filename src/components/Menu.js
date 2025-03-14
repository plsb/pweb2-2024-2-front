import React from 'react';
import { Link } from 'react-router-dom';

const Menu = ({ userRole }) => {
  return (
    <nav style={{ backgroundColor: '#f0f0f0', padding: '10px' }}>
      {/* O Menu já filtra as opções com base no userRole, e o UsersList verifica se o usuário é admin. */}
      <ul style={{ listStyle: 'none', display: 'flex', gap: '20px', margin: 0, padding: 0 }}>
        {userRole === 'admin' && (
          <li>
            <Link to="/users" style={{ textDecoration: 'none', color: '#333' }}>
              Usuários
            </Link>
          </li>
        )}
        {userRole === 'user' && (
          <>
            <li>
              <Link to="/categories" style={{ textDecoration: 'none', color: '#333' }}>
                Categorias
              </Link>
            </li>
            <li>
              <Link to="/products" style={{ textDecoration: 'none', color: '#333' }}>
                Produtos
              </Link>
            </li>
            <li>
              <Link to="/sales" style={{ textDecoration: 'none', color: '#333' }}>
                Vendas
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Menu;