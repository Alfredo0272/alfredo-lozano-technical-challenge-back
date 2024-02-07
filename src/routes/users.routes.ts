import { Router as createRouter } from 'express';
import createDebug from 'debug';
import { UsersController } from '../controllers/user.contorler.js';
import { UsersMongoRepo } from '../repos/user/user.repo.js';
import { AuthInterceptor } from '../middleware/auth.interceptor.js';
import { FileInterceptor } from '../middleware/file.interceptor.js';

const debug = createDebug('Challenge:users:router');
export const userRouter = createRouter();
debug('Starting');
const repo = new UsersMongoRepo();
const controller = new UsersController(repo);
const interceptor = new AuthInterceptor();
const fileInterceptor = new FileInterceptor();

userRouter.post('/login', controller.login.bind(controller));
userRouter.patch(
  '/login',
  interceptor.authorization.bind(interceptor),
  controller.login.bind(controller)
);
userRouter.post(
  '/register',
  fileInterceptor.singleFileStore('avatar').bind(fileInterceptor),
  controller.create.bind(controller)
);
userRouter.patch(
  '/follow',
  interceptor.authorization.bind(interceptor),
  controller.addFollow.bind(controller)
);
userRouter.patch(
  '/unFollow',
  interceptor.authorization.bind(interceptor),
  controller.removeFollower.bind(controller)
);
userRouter.delete(
  '/:id',
  interceptor.isAdmin.bind(interceptor),
  controller.delete.bind(controller)
);
