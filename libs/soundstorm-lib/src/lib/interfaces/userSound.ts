import { Schema } from 'mongoose';
import { IHasID } from './hasId';
import { IHasTimestamps } from './hasTimestamps';
import { IHasSoftDelete } from './hasSoftDelete';
import { IHasDeleter } from './hasDeleter';

export interface IUserSound
  extends IHasID,
    IHasTimestamps,
    IHasSoftDelete,
    IHasDeleter {
  user_id: Schema.Types.ObjectId;
  favorite_id: string;
  version: number;
  name: string;
  author: string;
  comment?: string;
  vendor: string;
  color: number;
  tempo: number;
  alias: string;
  product_id: string;
  product_version: number;
  bcvendor: string;
  entry1: string;
  entry2?: string;
  entry3?: string;
  mode_name: string;
  category: string;
  subcategory?: string;
  subsubcategory?: string;
}
