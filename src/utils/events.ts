type EventHandler = (data: any) => void;

export class EventEmitter {
    private events: Map<string, EventHandler[]>;

    constructor() {
        this.events = new Map();
    }

    public on(event: string, handler: EventHandler): void {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event)?.push(handler);
    }

    public emit(event: string, data: any): void {
        const handlers = this.events.get(event);
        if (handlers) {
            handlers.forEach(handler => handler(data));
        }
    }

    public off(event: string, handler: EventHandler): void {
        const handlers = this.events.get(event);
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }
}
