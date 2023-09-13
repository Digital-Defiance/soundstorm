import { Schema } from 'mongoose';
import ModelName from '../enumerations/modelName';
import { IUserFavorite } from '../interfaces/userFavorite';

export const UserFavoriteSchema = new Schema<IUserFavorite>({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: ModelName.User,
  },
  favorite_id: {
    type: String,
    required: true,
    ref: ModelName.UserSound,
  },
});
