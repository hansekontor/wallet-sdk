import { AuthProvider } from '../context/Auth';
import { WalletProvider } from '../context/Wallet';
import { NotificationsProvider } from '../context/Notifications';
import { DefaultNotification } from '../components/Notification/DefaultNotification';
import { AppProvider } from '../context/App';

export const MUSDProvider = ({
    children,
    Notification = DefaultNotification
}: { children: React.ReactElement, Notification: any }) => {
    return (
        <AuthProvider>
            <WalletProvider>
                <NotificationsProvider Notification={Notification}>
                    <AppProvider>
                        {children}
                    </AppProvider>
                </NotificationsProvider>
            </WalletProvider>
        </AuthProvider>
    )
}

export default MUSDProvider;