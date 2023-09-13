import { Schema } from 'mongoose';
import { IHasID } from './hasId';

export interface IUserFavorite extends IHasID {
  user_id: Schema.Types.ObjectId;
  favorite_id: Schema.Types.ObjectId;
}
