# Airtable With NestJS

This is one example of using Airtable with NestJS. It is based off of [nestjs-twilio](https://github.com/rejvban/nestjs-twilio) and leverages the [`airtable`](https://www.npmjs.com/package/airtable) module for the heavy lifting. The biggest thing it does is chunk up requests to Airtable, since the API is limited to 10 records at a time.

The included `todos` service has basic CRUD functionality and returns a plain object, but can also return the Airtable record by passing `returnAirtableRecord: true` as an optional argument to the different methods.

Feedback welcome!

## Prerequisites

- [pnpm](https://pnpm.io)
- An Airtable base with a table named `todos` with columns:
  - `description` (single line text)
  - `isComplete` (checkbox)

## Install

- `pnpm i`

## Config

- `cp .env.sample .env` and update values

## Develop

- `pnpm dev`

## Test

- 🤷🏻
