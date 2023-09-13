import { Schema } from 'mongoose';
import { IUserConceptSegment } from './userConceptSegment';
import { IHasID } from './hasId';
import { IHasTimestamps } from './hasTimestamps';
import { IHasSoftDelete } from './hasSoftDelete';
import { IHasDeleter } from './hasDeleter';

export interface IUserConcept
  extends IHasID,
    IHasTimestamps,
    IHasSoftDelete,
    IHasDeleter {
  user_id: Schema.Types.ObjectId;
  segments: IUserConceptSegment[];
}
