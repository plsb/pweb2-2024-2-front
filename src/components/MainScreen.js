import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Menu from './Menu';

const MainScreen = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
      } catch (error) {
        console.error('Erro ao decodificar token:', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  return (
    <div>
      <Menu userRole={userRole} />
      <Outlet context={{ userRole }} /> {/* Passa o userRole para as rotas filhas */}
    </div>
  );
};

export default MainScreen;