interface EventEmitterInterface {
    listeners: any
}

class EventEmitter implements EventEmitterInterface {
    listeners: any;

    constructor() {
        this.listeners = {};
    }

    on(event: string, callback: Function) {
        const hasListener = this.listeners[event] ? true : false;
        if (!hasListener) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    off(event: string, callback: Function) {
        const hasListener = this.listeners[event] ? true : false;
        if (hasListener) {
            this.listeners[event] = this.listeners[event].filter(
                (listener: Function) => listener !== callback
            );
        }
    }

    emit(event: string, type: string) {
        const hasListener = this.listeners[event] ? true : false;
        if (hasListener) {
            this.listeners[event].forEach((listener: Function) => listener(event, type));
        }
    }
}

export const EventBus = new EventEmitter();

export default EventBus;