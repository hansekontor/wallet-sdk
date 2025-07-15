import styled from 'styled-components';
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

export type NotificationType = {
    type: "info" | "error" | "success",
    message: string,
    id: any
}

export const DefaultNotification = ({ type, message }: NotificationType) => {

    const Notification = styled.div`
        padding: 18px  24px;
        color: white;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        background-color: ${() => {
            switch (type) {
                case 'error':
                    return 'red';
                case 'success':
                    return 'green';
                case 'info':
                    return 'blue';
                default:
                    return 'black';
            }
        }}
    `;

    return (
        <Notification>
            {type === "success" && <CheckCircleOutlined />}
            {type === "error" && <CloseCircleOutlined />}
            {type === "info" && <ExclamationCircleOutlined />}
            {message}
        </Notification>
    )
}
