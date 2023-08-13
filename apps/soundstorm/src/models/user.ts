import { Model, model, Schema } from 'mongoose';
import { IUser } from '../interfaces/user';

export const UserModelName = 'User';

export const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    // other validations
  },
  auth0Id: {
    type: String,
    required: true,
    unique: true,
  }
});

export const User: Model<IUser> = model<IUser>(UserModelName, userSchema);
