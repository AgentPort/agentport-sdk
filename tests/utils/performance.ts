interface PerformanceResult {
    operationName: string;
    iterations: number;
    totalTime: number;
    averageTime: number;
    minTime: number;
    maxTime: number;
    standardDeviation: number;
}

export class PerformanceTester {
    private results: PerformanceResult[] = [];

    /**
     * Measure performance of an operation
     */
    async measureOperation(
        operationName: string,
        operation: () => Promise<void>,
        iterations: number = 100
    ): Promise<PerformanceResult> {
        const times: number[] = [];

        for (let i = 0; i < iterations; i++) {
            const startTime = performance.now();
            await operation();
            const endTime = performance.now();
            times.push(endTime - startTime);
        }

        const result = this.calculateStats(operationName, times, iterations);
        this.results.push(result);
        return result;
    }

    /**
     * Calculate performance statistics
     */
    private calculateStats(
        operationName: string,
        times: number[],
        iterations: number
    ): PerformanceResult {
        const totalTime = times.reduce((a, b) => a + b, 0);
        const averageTime = totalTime / iterations;
        const minTime = Math.min(...times);
        const maxTime = Math.max(...times);

        // Calculate standard deviation
        const squareDiffs = times.map(time => {
            const diff = time - averageTime;
            return diff * diff;
        });
        const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / iterations;
        const standardDeviation = Math.sqrt(avgSquareDiff);

        return {
            operationName,
            iterations,
            totalTime,
            averageTime,
            minTime,
            maxTime,
            standardDeviation
        };
    }

    /**
     * Generate performance report
     */
    generateReport(): string {
        let report = 'Performance Test Results\n';
        report += '=======================\n\n';

        for (const result of this.results) {
            report += `Operation: ${result.operationName}\n`;
            report += `-----------------${'-'.repeat(result.operationName.length)}\n`;
            report += `Iterations: ${result.iterations}\n`;
            report += `Total Time: ${result.totalTime.toFixed(2)}ms\n`;
            report += `Average Time: ${result.averageTime.toFixed(2)}ms\n`;
            report += `Min Time: ${result.minTime.toFixed(2)}ms\n`;
            report += `Max Time: ${result.maxTime.toFixed(2)}ms\n`;
            report += `Standard Deviation: ${result.standardDeviation.toFixed(2)}ms\n\n`;
        }

        return report;
    }

    /**
     * Clear results
     */
    clearResults(): void {
        this.results = [];
    }
}
