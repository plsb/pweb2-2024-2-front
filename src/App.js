import React, { useState } from 'react';
import AppRoutes from './routes/Routes';

function App() {
  const [isAuthenticated, setAuthenticated] = useState(!!localStorage.getItem('token'));

  return <AppRoutes isAuthenticated={isAuthenticated} setAuthenticated={setAuthenticated} />;
}

export default App;