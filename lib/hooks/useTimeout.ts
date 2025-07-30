import { useEffect, useRef } from 'react';

export function useTimeout(callback: () => void, delay: number) {
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    useEffect(() => {
        let id: any = null;
        const tick = () => {
            const promise: any = savedCallback.current();
            if (promise instanceof Promise) {
                promise.then(() => {
                    id = setTimeout(tick, delay);
                });
            } else {
                id = setTimeout(tick, delay);
            }
        };

        if (id !== null) {
            id = setTimeout(tick, delay);
            return () => clearTimeout(id);
        } else {
            tick();
            return;
        }
    }, [delay]);
}

export default useTimeout;