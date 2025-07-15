import { useEffect, useState, type ReactNode } from 'react';
import styled, { css } from 'styled-components';

const SlideInAnimation = css`
    @keyframes slide-in-from-top {
        0% {
            transform: translateY(-100px);
            opacity: 0;
        }
        100% {
            transform: translateY(0);
            opacity: 1;
        }
    }
`;

interface Props {
    fadeOut: boolean
}

const NotificationAnimationDiv = styled.div<Props>`
    max-width: 480px;
    position: relative;
    z-index: 3000;
    animation: slide-in-from-top 0.5s cubic-bezier(0.24, 0.48, 0.47, 0.95);
    overflow: hidden;
    ${SlideInAnimation}	
    visibility: ${props => props.fadeOut ? "hidden" : "visible"};
    opacity: ${props => props.fadeOut ? 0 : 1};
    transition: ${props => props.fadeOut ? "visibility 0.5s linear, opacity 0.5s linear, max-height 1s 0.5s ease-out, margin-bottom 1s 0.5s" : "none"};
    max-height: ${props => props.fadeOut ? "0px" : "100%"};
    margin-bottom: ${props => props.fadeOut ? "0px" : "12px"};
`;

export function NotificationAnimation({ children, id, removeNotification }:
    { children: ReactNode, id: any, removeNotification: Function}
) {
    const [isClosing, setIsClosing] = useState(false);
    const [isClosed, setIsClosed] = useState(false);

    const sleep = (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // fade out notification after timeout
    useEffect(() => {
        const handleClosing = async () => {
            await sleep(3 * 1000);
            setIsClosing(true);
        };
        handleClosing();
    }, []);

    // close notification after fadeout
    useEffect(() => {
        const handleClosing = async () => {
            if (isClosing) {
                await sleep(2000);
                setIsClosed(true);
            }
        };
        handleClosing();
    }, [isClosing])

    if (isClosed) {
        removeNotification(id);
        return null;
    }

    return (
        <NotificationAnimationDiv fadeOut={isClosing}>
            {children}
        </NotificationAnimationDiv>
    )
}

export default NotificationAnimation;