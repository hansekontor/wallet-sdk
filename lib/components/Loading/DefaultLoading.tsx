import { Backdrop, Message, ModalContent, Spinner } from './DefaultLoading.styles';

const DefaultLoading = ({ children }:
    { children: React.ReactNode }
) => {

    return (
        <Backdrop>
            <ModalContent>
                <Spinner />
                <Message>{children}</Message>
            </ModalContent>
        </Backdrop>
    )
}

export default DefaultLoading;