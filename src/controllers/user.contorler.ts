import { NextFunction, Request, Response } from 'express';
import { User } from '../entities/user.js';
import { Controller } from './controller.js';
import { Auth } from '../services/auth.js';
import createDebug from 'debug';
import { UsersMongoRepo } from '../repos/user/user.repo.js';
import { HttpError } from '../types/http.error.js';
import { LoginResponse } from '../types/login.response.js';

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

      const data: LoginResponse = {
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

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file)
        throw new HttpError(406, 'Not Acceptable', 'Invalid multer file');
      const imgData = await this.cloudinaryService.uploadImage(req.file.path);
      req.body.avatar = imgData;
      super.create(req, res, next);
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
      const result = await this.repo.removeFollow(
        req.params.id,
        req.body.userId
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
