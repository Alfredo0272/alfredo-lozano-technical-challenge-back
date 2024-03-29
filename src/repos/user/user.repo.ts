import createDebug from 'debug';
import { Repository } from '../repo';
import { Auth } from '../../services/auth.js';
import { UserModel } from './user.mongo.model.js';
import { LoginUser, User } from '../../entities/user.js';
import { HttpError } from '../../types/http.error.js';

const debug = createDebug('Challenge:users:mongo:repo');

export class UsersMongoRepo implements Repository<User> {
  constructor() {
    debug('Instantiated');
  }

  async create(newItem: Omit<User, 'id'>): Promise<User> {
    newItem.password = await Auth.hash(newItem.password);
    const result: User = await UserModel.create(newItem);
    return result;
  }

  async login(loginUser: LoginUser): Promise<User> {
    const result = await UserModel.findOne({ email: loginUser.email })
      .populate('follow', 'follower', 'post')
      .exec();
    if (!result || !(await Auth.compare(loginUser.password, result.password)))
      throw new HttpError(401, 'Unauthorized');
    return result;
  }

  async getAll(): Promise<User[]> {
    const result = await UserModel.find()
      .populate('follow', 'follower', 'post')
      .exec();
    return result;
  }

  async getById(id: string): Promise<User> {
    const data = await UserModel.findById(id)
      .populate('follow', 'follower', 'post')
      .exec();
    if (!data) {
      throw new HttpError(404, 'Not Found', 'User not found in file system', {
        cause: 'Trying findById',
      });
    }

    return data;
  }

  async search({
    key,
    value,
  }: {
    key: keyof User;
    value: any;
  }): Promise<User[]> {
    const result = await UserModel.find({ [key]: value })
      .populate('follow', { user: 0 }, 'follower', { user: 0 })
      .exec();
    return result;
  }

  async update(id: string, updatedItem: Partial<User>): Promise<User> {
    const data = await UserModel.findByIdAndUpdate(id, updatedItem, {
      new: true,
    })
      .populate('follow', 'follower', 'post')
      .exec();
    if (!data)
      throw new HttpError(404, 'Not Found', 'User not found in file system', {
        cause: 'Trying findByIdAndUpdate',
      });
    return data;
  }

  async delete(id: string): Promise<void> {
    const result = await UserModel.findByIdAndDelete(id)
      .populate('follow', 'follower', 'post')
      .exec();
    if (!result) {
      throw new HttpError(404, 'Not Found', 'Delete not possible');
    }
  }

  async addFollower(followId: User['id'], userId: User['id']): Promise<User> {
    if (followId === userId)
      throw new HttpError(406, 'Not Acceptable', "You can't add yourself");

    const followUser = await UserModel.findById(followId)
      .populate('follow', 'follower', 'post')
      .exec();
    const user = await UserModel.findById(userId)
      .populate('follow', 'follower', 'post')
      .exec();

    if (!followUser || !user) {
      throw new HttpError(404, 'Not Found', 'User not found');
    }

    if (followUser.follower.includes(user)) {
      return user;
    }

    const updateUser = await UserModel.findByIdAndUpdate(
      userId,
      { $push: { follow: followUser } },
      { new: true }
    ).exec();

    if (!updateUser) {
      throw new HttpError(404, 'Not Found', 'Update not possible');
    }

    const updateFollowUser = await UserModel.findByIdAndUpdate(
      followId,
      { $push: { follower: user } },
      { new: true }
    ).exec();

    if (!updateFollowUser) {
      throw new HttpError(404, 'Not Found', 'Update not possible');
    }

    return updateUser;
  }

  async removeFollow(
    FollowIdToRemove: User['id'],
    userId: User['id']
  ): Promise<User> {
    // eslint-disable-next-line no-useless-catch
    try {
      const user = await UserModel.findById(userId)
        .populate('follow', 'follower', 'post')
        .exec();

      if (!user) {
        throw new HttpError(404, 'Not Found', 'User not found');
      }

      if (!user.follow.includes(FollowIdToRemove as unknown as User)) {
        return user;
      }

      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { $pull: { follow: FollowIdToRemove } },
        { new: true }
      ).exec();

      if (!updatedUser) {
        throw new HttpError(404, 'Not Found', 'Update not possible');
      }

      const updateUnFollowUser = await UserModel.findByIdAndUpdate(
        FollowIdToRemove,
        { $pull: { follower: userId } },
        { new: true }
      ).exec();

      if (!updateUnFollowUser) {
        throw new HttpError(404, 'Not Found', 'Update not possible');
      }

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
}
