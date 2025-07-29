import { Context } from 'react';
type Auth = {
    isAuthenticationRequired: boolean;
};
export declare const AuthContext: Context<Auth>;
export declare const AuthProvider: ({ children }: {
    children: React.ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
export declare const useAuth: () => Auth;
export {};
