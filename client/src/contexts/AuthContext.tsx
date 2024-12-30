import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth';
import { User } from '../types/types'; // Adjust the import path as necessary

interface AuthContextType {
  user: Omit<User, 'password'> | null;
  shopOwnerId: number | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Omit<User, 'password'> | null>(null);
  const [shopOwnerId, setShopOwnerId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authService.getCurrentUser(token).then((user) => {
        setUser(user);
        setShopOwnerId(user.id); // Assuming the user object contains id
      }).catch(() => {
        setUser(null);
        setShopOwnerId(null);
      });
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    const { user, token } = await authService.login({ email, password });
    localStorage.setItem('token', token);
    setUser(user);
    setShopOwnerId(user.id); // Assuming the user object contains id
  };

  const signOut = () => {
    localStorage.removeItem('token');
    setUser(null);
    setShopOwnerId(null);
  };

  return (
    <AuthContext.Provider value={{ user, shopOwnerId, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};