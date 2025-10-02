import React, { createContext, useContext, useState } from 'react';

/**
 * Basic user model used for authentication.  In a real application
 * this would likely include more fields and be provided by an
 * identity service.  Here it serves purely as a demonstration of
 * context usage and can be extended later.
 */
export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextProps {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

/**
 * Custom hook to access the authentication context.  Throws an
 * informative error if used outside of its provider to make it
 * obvious when configuration is missing.
 */
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Provider component for authentication state.  It exposes a user
 * object and simple login/logout functions.  This is a placeholder
 * implementation; a production application would integrate with an
 * OAuth provider or back‑end session management.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (u: User) => {
    setUser(u);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};