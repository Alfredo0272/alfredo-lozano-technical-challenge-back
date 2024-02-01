import { NextFunction, Request, Response } from 'express';
import { User } from '../entities/user.js';
import { Controller } from './controller.js';
import { Auth } from '../services/auth.js';
import createDebug from 'debug';
import { UsersMongoRepo } from '../repos/user.repo.js';

const debug = createDebug('Challenge:users:controller');
export class UsersController extends Controller<User> {
  constructor(protected repo: UsersMongoRepo) {
    super(repo);
    debug('Instantiated');
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = req.body.userId
        ? await this.repo.getById(req.body.userId)
        : await this.repo.login(req.body);

      const data = {
        user: result,
        token: Auth.signJWT({
          id: result.id,
          email: result.email,
          role: result.role,
        }),
      };
      res.status(202);
      res.statusMessage = 'Accepted';
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async addFollow(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.addFollower(
        req.params.id,
        req.body.userId
      );

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async removeFollower(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.removeFollower(
        req.params.id,
        req.body.userId
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await this.repo.delete(req.params.id);
      res.status(204);
      res.statusMessage = 'No Content';
      res.json({});
    } catch (error) {
      next(error);
    }
  }
}
