import createDebug from 'debug';
import { Repository } from '../repo';
import { Post } from '../../entities/posts';
import { PostModel } from './post.mongo.model';
import { HttpError } from '../../types/http.error';
import { UsersMongoRepo } from '../user/user.repo';

const debug = createDebug('Challenge:post:mongo:repo');

export class PostMongoRepo implements Repository<Post> {
  userRepo: UsersMongoRepo;
  constructor() {
    this.userRepo = new UsersMongoRepo();
    debug('Instantiated');
  }

  async getAll(): Promise<Post[]> {
    const result = await PostModel.find().populate('author').exec();
    if (!result)
      throw new HttpError(404, 'Not Found', 'Beer not found in file sistem');
    return result;
  }

  async getById(id: string): Promise<Post> {
    const result = await PostModel.findById(id).populate('author').exec();
    if (!result)
      throw new HttpError(404, 'Not Found', 'Beer not found in file sistem', {
        cause: 'trying findById',
      });
    return result;
  }

  async search({
    key,
    value,
  }: {
    key: keyof Post;
    value: any;
  }): Promise<Post[]> {
    const result = await PostModel.find({ [key]: value })
      .populate('author')
      .exec();
    return result;
  }

  async create(newItem: Omit<Post, 'id'>): Promise<Post> {
    const userID = newItem.author.id;
    const user = await this.userRepo.getById(userID);
    const result: Post = await PostModel.create({ ...newItem, author: userID });
    user.posts.push(result);
    await this.userRepo.update(userID, user);
    return result;
  }

  async update(id: string, updatedItem: Partial<Post>): Promise<Post> {
    const result = await PostModel.findByIdAndUpdate(id, updatedItem, {
      new: true,
    })
      .populate('author')
      .exec();
    if (!result) throw new HttpError(404, 'Not Found', 'Update not possible');
    return result;
  }

  async delete(id: string): Promise<void> {
    const result = await PostModel.findByIdAndDelete(id)
      .populate('author')
      .exec();
    if (!result) throw new HttpError(404, 'Not Found', 'Update not possible');
  }
}
