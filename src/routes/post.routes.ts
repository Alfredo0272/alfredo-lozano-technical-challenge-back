import { Router as createRouter } from 'express';
import createDebug from 'debug';
import { AuthInterceptor } from '../middleware/auth.interceptor.js';
import { FileInterceptor } from '../middleware/file.interceptor.js';
import { PostMongoRepo } from '../repos/posts/post.repo.js';
import { PostController } from '../controllers/post.controler.js';

const debug = createDebug('Challenge:posts:router');
export const postRouter = createRouter();
debug('Starting');
const repo = new PostMongoRepo();
const controller = new PostController(repo);
const interceptor = new AuthInterceptor();
const fileInterceptor = new FileInterceptor();

postRouter.post(
  '/create',
  interceptor.authorization.bind(interceptor),
  fileInterceptor.singleFileStore('file').bind(fileInterceptor),
  controller.create.bind(controller)
);

postRouter.delete(
  '/delete',
  interceptor.authorization.bind(interceptor),
  controller.delete.bind(controller)
);
