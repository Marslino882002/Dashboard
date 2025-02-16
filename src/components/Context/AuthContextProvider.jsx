import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token')); 


  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}
