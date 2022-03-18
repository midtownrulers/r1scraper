/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const ts_preset = require('ts-jest/jest-preset')
const puppeteer_preset = require('jest-puppeteer/jest-preset')

module.exports = {
  ...puppeteer_preset,
  ...ts_preset,
  testTimeout: 900000,
  testPathIgnorePatterns: ["<rootDir>(\/.*\/)*lib\.(ts|js)"]
}