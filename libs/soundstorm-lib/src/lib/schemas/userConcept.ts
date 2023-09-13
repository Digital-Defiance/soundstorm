import { Schema } from 'mongoose';
import ModelName from '../enumerations/modelName'; // Assuming you have a ModelName enumeration
import { IUserConceptSegment } from '../interfaces/userConceptSegment';
import { IUserConcept } from '../interfaces/userConcept';

const UserConceptSegmentSchema = new Schema<IUserConceptSegment>({
  name: {
    type: String,
    required: true,
  },
  favorite_ids: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: ModelName.UserSound,
  },
});

export const UserConceptSchema = new Schema<IUserConcept>({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: ModelName.User,
  },
  segments: {
    type: [UserConceptSegmentSchema],
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  deletedAt: {
    type: Date,
    optional: true,
  },
  deletedBy: {
    type: Schema.Types.ObjectId,
    ref: ModelName.User,
    optional: true,
  },
});
