export class Logger {
    private context: string;

    constructor(context: string) {
        this.context = context;
    }

    public debug(message: string, meta?: Record<string, any>): void {
        this.log('DEBUG', message, meta);
    }

    public info(message: string, meta?: Record<string, any>): void {
        this.log('INFO', message, meta);
    }

    public warn(message: string, meta?: Record<string, any>): void {
        this.log('WARN', message, meta);
    }

    public error(message: string, meta?: Record<string, any>): void {
        this.log('ERROR', message, meta);
    }

    private log(level: string, message: string, meta?: Record<string, any>): void {
        const timestamp = new Date().toISOString();
        const metaString = meta ? JSON.stringify(meta) : '';
        console.log(`[${timestamp}] ${level} [${this.context}] ${message} ${metaString}`);
    }
}
