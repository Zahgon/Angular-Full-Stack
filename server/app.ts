import 'dotenv/config';
import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import formbody from '@fastify/formbody';
import { join as pathJoin } from 'path';

import { connectToMongo } from './mongo';
import setRoutes from './routes';

const feDir = 'public/browser';
const app = Fastify({
  logger: process.env.NODE_ENV !== 'test',
});
const port = Number(process.env.PORT) || 3000;

app.register(formbody);
app.register(fastifyStatic, {
  root: pathJoin(__dirname, `../${feDir}`),
  prefix: '/',
});

// SPA fallback: serve index.html for unmatched GET/HEAD routes (Angular client-side routing)
app.setNotFoundHandler((request, reply) => {
  if (request.method === 'GET' || request.method === 'HEAD') {
    return reply.sendFile('index.html');
  }
  return reply.code(404).send({ error: `Route ${request.method}:${request.url} not found` });
});

setRoutes(app);

const main = async (): Promise<void> => {
  try {
    await connectToMongo();
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`Angular Full Stack listening on port ${port}`);
  } catch (error) {
    console.error(error);
  }
};

if (process.env.NODE_ENV !== 'test') {
  main();
}

export { app };
