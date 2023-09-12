import { Model } from 'mongoose';
import { IUser } from './user';
import { IUserSound } from './userSound';

export interface ISchemaModels {
  User: Model<IUser>;
  UserSound: Model<IUserSound>;
}
