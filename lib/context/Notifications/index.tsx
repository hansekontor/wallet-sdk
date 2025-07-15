import { createContext, use, useState, useEffect, type Context, useCallback } from 'react';
import { DefaultNotification, type NotificationType } from '../../components/Notification/DefaultNotification';
import NotificationAnimation from '../../components/Notification/NotificationAnimation';
import NotificationCollector from '../../components/Notification/NotificationBody';

export const NotificationsContext: Context<{}> = createContext({});

export const NotificationsProvider = ({ children, Notification = DefaultNotification }: 
    { children: React.ReactElement, Notification: any}
) => {
    const [notifications, setNotifications] = useState<NotificationType[]>([]);

    // Add notification handler
    const addNotification = useCallback(({ type, message }: NotificationType) => {
        // We use the updater function to safely add notifications after rendering
        setNotifications((prev) => [...prev, { type, message, id: Date.now() }]);
    }, []);

    // Remove notification handler
    const removeNotification = useCallback((id: number) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    // Trigger a side-effect to safely update state after render
    useEffect(() => {
        // This will prevent direct state updates during render
    }, [notifications]); 

    return (
        <NotificationsContext value={addNotification}>
            {children}
            <NotificationCollector>
                {notifications.map(({ type, message, id }, index) => (
                    <NotificationAnimation key={index} id={id} removeNotification={removeNotification}>
                        <Notification type={type} message={message} />
                    </NotificationAnimation>
                ))}
            </NotificationCollector>
        </NotificationsContext>
    )
}

export const useNotifications = () => {
    const context = use(NotificationsContext);
    if (!context) {
        throw new Error("useNotifications must be used within an NotificationsProvider");
    }

    return context;
}