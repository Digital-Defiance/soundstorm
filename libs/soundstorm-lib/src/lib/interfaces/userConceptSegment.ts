import { Schema } from 'mongoose';

export interface IUserConceptSegment {
  name: string;
  favorite_ids: Schema.Types.ObjectId[];
}
