import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isGoogleUser: boolean;
  setIsGoogleUser: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isGoogleUser, setIsGoogleUser] = useState<boolean>(false);

  return (
    <AuthContext.Provider value={{ isGoogleUser, setIsGoogleUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
