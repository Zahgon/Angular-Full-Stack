
import request from 'supertest';
import { describe, expect, test } from '@jest/globals';
process.env.NODE_ENV = 'test';

import { app } from '../app';
import { connectToMongo, disconnectMongo } from '../mongo';

const newCat = { name: 'Fluffy', weight: 4, age: 2 };
let catId = '';

beforeAll(async () => {
  await app.ready();
  await connectToMongo();
});

afterAll(async () => {
  await request(app.server).delete('/api/cats/delete');
  await app.close();
  await disconnectMongo();
});

describe('Cat tests', () => {
  test('should get all cats', async () => {
    const res = await request(app.server).get('/api/cats');
    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual([]);
  });
  test('should count all cats', async () => {
    const res = await request(app.server).get('/api/cats/count');
    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual(0);
  });
  test('should create a new cat', async () => {
    const res = await request(app.server).post('/api/cat').send(newCat);
    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject(newCat);
    catId = res.body._id;
  });
  test('should get a cat by id', async () => {
    const res = await request(app.server).get(`/api/cat/${catId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject(newCat);
  });
  test('should update a cat by id', async () => {
    const res = await request(app.server).put(`/api/cat/${catId}`).send({ weight: 5 });
    expect(res.statusCode).toBe(200);
  });
  test('should delete a cat by id', async () => {
    const res = await request(app.server).delete(`/api/cat/${catId}`);
    expect(res.statusCode).toBe(200);
  });
});
