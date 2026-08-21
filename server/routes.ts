import { FastifyInstance } from 'fastify';

import CatCtrl from './controllers/cat';
import UserCtrl from './controllers/user';

const setRoutes = (app: FastifyInstance): void => {
  const catCtrl = new CatCtrl();
  const userCtrl = new UserCtrl();

  const routes = async (router: FastifyInstance): Promise<void> => {
    // Cats
    router.get('/cats', catCtrl.getAll);
    router.get('/cats/count', catCtrl.count);
    router.post('/cat', catCtrl.insert);
    router.get('/cat/:id', catCtrl.get);
    router.put('/cat/:id', catCtrl.update);
    router.delete('/cat/:id', catCtrl.delete);

    // Users
    router.post('/login', userCtrl.login);
    router.get('/users', userCtrl.getAll);
    router.get('/users/count', userCtrl.count);
    router.post('/user', userCtrl.insert);
    router.get('/user/:id', userCtrl.get);
    router.put('/user/:id', userCtrl.update);
    router.delete('/user/:id', userCtrl.delete);

    // Test routes
    if (process.env.NODE_ENV === 'test') {
      router.delete('/cats/delete', catCtrl.deleteAll);
      router.delete('/users/delete', userCtrl.deleteAll);
    }
  };

  // Apply the routes to our application with the prefix /api
  app.register(routes, { prefix: '/api' });

};

export default setRoutes;
