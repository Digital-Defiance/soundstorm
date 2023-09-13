import { Model } from 'mongoose';
import { IUser } from './user';
import { IUserConcept } from './userConcept';
import { IUserSound } from './userSound';
import { IUserFavorite } from './userFavorite';

export interface ISchemaModels {
  User: Model<IUser>;
  UserConcept: Model<IUserConcept>;
  UserFavorite: Model<IUserFavorite>;
  UserSound: Model<IUserSound>;
}
