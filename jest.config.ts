import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  moduleNameMapper: {
    '^(.*)\\.js$': '$1', // fix import paths if you use ESM-style imports
  },
  clearMocks: true,
  coverageDirectory: 'coverage',
};

export default config;
