module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    roots: ['<rootDir>/tests'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    testMatch: ['**/*.test.ts'],
};
