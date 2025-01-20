import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/tests'],
    testMatch: [
        '**/__tests__/**/*.+(ts|tsx|js)',
        '**/?(*.)+(spec|test).+(ts|tsx|js)'
    ],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest'
    },
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'clover'],
    collectCoverageFrom: [
        'src/**/*.{js,ts}',
        '!src/**/*.d.ts',
        '!src/**/*.types.ts'
    ],
    setupFilesAfterEnv: ['<rootDir>/tests/utils/setup.ts'],
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json',
            diagnostics: false
        }
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    }
};

export default config;
