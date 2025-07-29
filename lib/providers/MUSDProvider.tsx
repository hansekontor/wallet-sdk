import { AuthProvider } from '../context/Auth';
import { WalletProvider } from '../context/Wallet';
import { AppProvider } from '../context/App';

export const MUSDProvider = ({
    children,
}: { children: React.ReactElement }) => {
    return (
        <AuthProvider>
            <WalletProvider>
                <AppProvider>
                    {children}
                </AppProvider>
            </WalletProvider>
        </AuthProvider>
    )
}

export default MUSDProvider;