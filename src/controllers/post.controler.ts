import { Post } from '../entities/posts';
import { PostMongoRepo } from '../repos/posts/post.repo';
import { UsersMongoRepo } from '../repos/user/user.repo';
import { Controller } from './controller';
import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';

const debug = createDebug('Challenge:posts:controller');
export class PostController extends Controller<Post> {
  userRepo: UsersMongoRepo;
  constructor(protected repo: PostMongoRepo) {
    super(repo);
    this.userRepo = new UsersMongoRepo();
    debug('Instantiated');
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.author = { id: req.body.userId };
      super.create(req, res, next);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const postId = req.params.id;
      await this.repo.delete(postId);
      const post = await this.repo.getById(postId);
      const userId = post.author.id;
      const user = await this.userRepo.getById(userId);
      const index = user.posts.findIndex((item: Post) => item.id === postId);
      if (index !== -1) {
        user.posts.splice(index, 1);
      }

      await this.userRepo.update(userId, user);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
}
