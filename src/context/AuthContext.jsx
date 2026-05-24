import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, isFirebaseConfigured } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { loginVendor, logoutVendor } from '../services/auth';

const AuthContext = createContext(null);

/**
 * Authentication provider context to wrap the application and manage auth state.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFirebaseConfigured) {
      // Live Firebase Auth listener
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      });
      return unsubscribe;
    } else {
      // Local Mock Auth listener using custom window events
      const getMockUser = () => {
        const stored = localStorage.getItem("kantina_mock_user");
        return stored ? JSON.parse(stored) : null;
      };

      setUser(getMockUser());
      setLoading(false);

      const handleMockAuthChange = () => {
        setUser(getMockUser());
      };

      window.addEventListener("kantina_mock_auth_change", handleMockAuthChange);
      return () => {
        window.removeEventListener("kantina_mock_auth_change", handleMockAuthChange);
      };
    }
  }, []);

  const value = {
    user,
    loading,
    login: loginVendor,
    logout: logoutVendor,
    isMock: !isFirebaseConfigured
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to consume the AuthContext state and functions.
 * @returns {{user: object|null, loading: boolean, login: Function, logout: Function, isMock: boolean}}
 */
export function useAuth() {
  return useContext(AuthContext);
}
