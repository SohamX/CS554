import React, { createContext, useContext, useState, useCallback } from 'react';

const ApiContext = createContext();

// Create a provider component
export const ApiProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiCall = useCallback(async (url, options) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      setError(err.message);
      throw err;
    }
  }, []);

  return (
    <ApiContext.Provider value={{ apiCall, loading, error }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  return useContext(ApiContext);
};