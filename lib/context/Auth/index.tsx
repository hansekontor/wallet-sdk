import { createContext, useContext } from "react";

type Auth = {
  isAuthenticationRequired: boolean;
};

export const AuthContext = createContext<Auth | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const context: Auth = {
    isAuthenticationRequired: false,
  };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
