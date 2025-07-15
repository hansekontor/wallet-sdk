import { createContext, use, type Context } from 'react';

type Auth = {
    isAuthenticationRequired: boolean
}
export const AuthContext: Context<Auth> = createContext({} as Auth);

export const AuthProvider = ({ children }: 
    { children: React.ReactNode}
) => {
    const context: Auth = {
        isAuthenticationRequired: false
    };

    return (
        <AuthContext value={context}>
            {children}
        </AuthContext>
    )
}

export const useAuth = () => {
    const context = use(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}