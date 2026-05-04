// frontend/src/context/AuthContext.jsx

import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user data from localStorage on app start
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("auth_token");
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
      localStorage.clear(); // Clear storage if there's an error
    }
  }, []);

  const login = (userData, token) => {
    // Save to localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("auth_token", token);
    
    // Set global state
    setUser(userData);
  };

  const logout = () => {
    // Clear global state
    setUser(null);
    
    // Clear localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("auth_token");
    
    // Redirect to home or signin page
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};