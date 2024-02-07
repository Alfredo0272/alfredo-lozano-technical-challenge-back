import { Post } from '../../entities/posts';
import { Schema, model } from 'mongoose';

export const postSchema = new Schema<Post>({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  file: {
    publicId: String,
    size: Number,
    format: String,
    url: String,
    required: false,
  },
  text: String,
  // eslint-disable-next-line camelcase
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export const PostModel = model('Post', postSchema, 'posts');

postSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
