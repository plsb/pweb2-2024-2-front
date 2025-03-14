// components/UsersList.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useOutletContext } from 'react-router-dom';

const UsersList = ( ) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { userRole } = useOutletContext();

  useEffect(() => {
    if (userRole !== 'admin') {
      navigate('/'); // Redireciona se não for admin
      return;
    }

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await api.get('/auth/users');
        if (!response.data || !Array.isArray(response.data.users)) {
          throw new Error('Erro ao buscar usuários');
        }
    
        setUsers(response.data.users);
      } catch (err) {
        setError(err.message);
        if (err.message === 'Unauthorized') {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userRole, navigate]);

  if (userRole !== 'admin') {
    return null; // Não renderiza nada se não for admin
  }

  return (
    <div>
      <h2>Lista de Usuários</h2>
      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Nome</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.id}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.name}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.email}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UsersList;