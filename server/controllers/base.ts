import { FastifyRequest, FastifyReply } from 'fastify';
import { Model, UpdateQuery } from 'mongoose';

abstract class BaseCtrl<T> {

  abstract model:Model<T>

  // Get all
  getAll = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const docs = await this.model.find({});
      return reply.code(200).send(docs);
    } catch (err) {
      return reply.code(400).send({ error: (err as Error).message });
    }
  };

  // Count all
  count = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const count = await this.model.countDocuments();
      return reply.code(200).send(count);
    } catch (err) {
      return reply.code(400).send({ error: (err as Error).message });
    }
  };

  // Insert
  insert = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const obj = await new this.model(request.body as Partial<T>).save();
      return reply.code(201).send(obj);
    } catch (err) {
      return reply.code(400).send({ error: (err as Error).message });
    }
  };

  // Get by id
  get = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const obj = await this.model.findOne({ _id: (request.params as { id: string }).id });
      return reply.code(200).send(obj);
    } catch (err) {
      return reply.code(500).send({ error: (err as Error).message });
    }
  };

  // Update by id
  update = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await this.model.findOneAndUpdate({ _id: (request.params as { id: string }).id }, request.body as UpdateQuery<T>);
      return reply.code(200).send('OK');
    } catch (err) {
      return reply.code(400).send({ error: (err as Error).message });
    }
  };

  // Delete by id
  delete = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await this.model.findOneAndDelete({ _id: (request.params as { id: string }).id });
      return reply.code(200).send('OK');
    } catch (err) {
      return reply.code(400).send({ error: (err as Error).message });
    }
  };

  // Drop collection (for tests)
  deleteAll = async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      await this.model.deleteMany();
      return reply.code(200).send('OK');
    } catch (err) {
      return reply.code(400).send({ error: (err as Error).message });
    }
  };
}

export default BaseCtrl;
