# Task: Migrate this project's backend from Express to Fastify

Migrate the Node.js backend of this Angular Full Stack project from the Express web
framework to Fastify, preserving its behavior exactly.

## Requirements
- Read the existing Express backend under `server/` and port it to Fastify.
- Replace Express and its middleware with idiomatic Fastify equivalents.
- Keep the data models, database layer, and resource/configuration files the code relies on, and use them unchanged where possible.
- Preserve the same public HTTP interface and behavior as the original (routes, response payloads, and status results).

## Done when
The backend test suite passes (`npm run test:be`).
