import { Schema } from 'mongoose';
import ModelName from '../enumerations/modelName';
import { IUserSound } from '../interfaces/userSound';

export const UserSoundSchema = new Schema<IUserSound>({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: ModelName.User,
  },
  favorite_id: {
    type: String,
    required: true,
  },
  version: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: false,
  },
  vendor: {
    type: String,
    required: true,
  },
  color: {
    type: Number,
    required: true,
  },
  tempo: {
    type: Number,
    required: true,
  },
  alias: {
    type: String,
    required: true,
  },
  product_id: {
    type: String,
    required: true,
  },
  product_version: {
    type: Number,
    required: true,
  },
  bcvendor: {
    type: String,
    required: true,
  },
  entry1: {
    type: String,
    required: true,
  },
  entry2: {
    type: String,
    required: false,
  },
  entry3: {
    type: String,
    required: false,
  },
  mode_name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subcategory: {
    type: String,
    required: false,
  },
  subsubcategory: {
    type: String,
    required: false,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  /**
   * The date/time the user was deleted.
   */
  deletedAt: { type: Date, optional: true },
  /**
   * The user who deleted the user.
   */
  deletedBy: {
    type: Schema.Types.ObjectId,
    ref: ModelName.User,
    optional: true,
  },
});

UserSoundSchema.index({ user_id: 1, favorite_id: 1 });
