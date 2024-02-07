import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import createDebug from 'debug';
import { userRouter } from './routes/users.routes';
import { postRouter } from './routes/post.routes';

const debug = createDebug('Challenge:app');
export const app = express();
debug('Starting');

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));
app.use('/user', userRouter);
app.use('/post', postRouter);
