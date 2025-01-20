declare global {
    namespace jest {
        interface Matchers<R> {
            toBeVector(): R;
            toHaveMetric(metric: string): R;
            toBeWithinTolerance(expected: number, tolerance?: number): R;
        }
    }
}

expect.extend({
    toBeVector(received: any) {
        const pass = received instanceof Float32Array;
        return {
            message: () => `expected ${received} to be a Float32Array`,
            pass
        };
    },

    toHaveMetric(received: any, metric: string) {
        const pass = typeof received === 'object' && 
                    received !== null && 
                    metric in received;
        return {
            message: () => `expected object to have metric ${metric}`,
            pass
        };
    },

    toBeWithinTolerance(received: number, expected: number, tolerance: number = 1e-6) {
        const pass = Math.abs(received - expected) <= tolerance;
        return {
            message: () => 
                `expected ${received} to be within ${tolerance} of ${expected}`,
            pass
        };
    }
});

export {};
