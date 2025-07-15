import { type ReactNode } from 'react';
import styled from 'styled-components';

const NotificationBody = styled.div`
    top: 0;
    left: 0;
    margin: 0;
    padding: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const NotificationContainer = styled.div`
	position: fixed;
	top: 30px;
    width: 480px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    @media (max-width: 480px) {
        width: 100%;
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;
    }
`;

export default function NotificationCollector({ children }: { children: ReactNode}) {
    return (
        <NotificationBody>
            <NotificationContainer>
                {children}
            </NotificationContainer>
        </NotificationBody>
    )
}