import React from 'react';
import { Link } from 'react-router-dom';

const Menu = () => {
  return (
    <nav style={{ backgroundColor: '#f0f0f0', padding: '10px' }}>
      <ul style={{ listStyle: 'none', display: 'flex', gap: '20px', margin: 0, padding: 0 }}>
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
      </ul>
    </nav>
  );
};

export default Menu;