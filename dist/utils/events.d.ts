interface EventEmitterInterface {
    listeners: any;
}
declare class EventEmitter implements EventEmitterInterface {
    listeners: any;
    constructor();
    on(event: string, callback: Function): void;
    off(event: string, callback: Function): void;
    emit(event: string, type: string): void;
}
export declare const EventBus: EventEmitter;
export default EventBus;
