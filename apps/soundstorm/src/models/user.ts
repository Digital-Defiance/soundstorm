import { Model, model, Schema } from 'mongoose';
import { IUser } from '../interfaces/user';

export const UserModelName = 'User';

export const userSchema = new Schema({
  email: String,
  auth0Id: String,
});

export const User: Model<IUser> = model<IUser>(UserModelName, userSchema);
