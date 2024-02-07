import { ImgData } from '../types/img.data';
import { User } from './user';

export type Post = {
  id: string;
  author: User;
  text: string;
  file: ImgData;
  created_at: Date;
};
