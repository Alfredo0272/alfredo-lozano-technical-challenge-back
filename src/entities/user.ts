import { ImgData } from '../types/img.data';
import { Post } from './posts';

export type LoginUser = {
  email: string;
  password: string;
};

export type User = LoginUser & {
  id: string;
  name: string;
  age: number;
  userName: string;
  surname: string;
  password: string;
  avatar: ImgData;
  role: 'Admin' | 'User';
  follow: User[];
  follower: User[];
  posts: Post[];
};
