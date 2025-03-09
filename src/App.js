import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/Routes';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  return (
    <Router>
      <AppRoutes
        isAuthenticated={isAuthenticated}
        setAuthenticated={setIsAuthenticated}
      />
    </Router>
  );
};

export default App;