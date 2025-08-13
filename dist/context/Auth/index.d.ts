type Auth = {
    isAuthenticationRequired: boolean;
};
export declare const AuthContext: import('react').Context<Auth | undefined>;
export declare const AuthProvider: ({ children }: {
    children: React.ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
export declare const useAuth: () => Auth;
export {};
