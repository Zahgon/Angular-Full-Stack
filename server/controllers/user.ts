import { sign, Secret } from 'jsonwebtoken';
import { FastifyRequest, FastifyReply } from 'fastify';
import { UpdateQuery } from 'mongoose';

import User, { IUser } from '../models/user';
import BaseCtrl from './base';

const secret: Secret = process.env.SECRET_TOKEN as string;

class UserCtrl extends BaseCtrl<IUser> {
  model = User;

  login = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = request.body as { email: string; password: string };
      const user = await this.model.findOne({ email: body.email });
      if (!user) {
        return reply.code(403).send();
      }
      const isMatch = await new Promise<boolean>((resolve) => {
        user.comparePassword(body.password, (error, matched: boolean) => {
          resolve(!error && matched);
        });
      });
      if (!isMatch) {
        return reply.code(403).send();
      }
      const token = sign({ user }, secret, { expiresIn: '24h' });
      return reply.code(200).send({ token });
    } catch (err) {
      return reply.code(400).send({ error: (err as Error).message });
    }
  };

  update = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await this.model.findOneAndUpdate({ _id: (request.params as { id: string }).id }, request.body as UpdateQuery<IUser>, { new: true });
      if (!user) {
        return reply.code(404).send();
      }
      const token = sign({ user }, secret, { expiresIn: '24h' });
      return reply.code(200).send({ token });
    } catch (err) {
      return reply.code(400).send({ error: (err as Error).message });
    }
  };

}

export default UserCtrl;
