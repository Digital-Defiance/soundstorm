import sqlite3, { Database } from 'better-sqlite3';
import { promisify } from 'util';
import {
  BaseModel,
  IUser,
  IUserSound,
  ModelName,
} from '@soundstorm/soundstorm-lib';
import { UpdateWriteOpResult } from 'mongoose';

const UserSoundModel = BaseModel.getModel<IUserSound>(ModelName.UserSound);

function rowToInterface(row: any, user: IUser): IUserSound {
  const date = new Date();
  // for each of the fields in the row, we need to map it to the interface, but some of the fields are null and in mongo we want to drop those fields
  const userSound: IUserSound = {
    user_id: user._id,
    favorite_id: row.favorite_id,
    version: row.version,
    name: row.name,
    author: row.author,
    comment: row.comment,
    vendor: row.vendor,
    color: row.color,
    tempo: row.tempo,
    alias: row.alias,
    product_id: row.product_id,
    product_version: row.product_version,
    bcvendor: row.bcvendor,
    entry1: row.entry1,
    ...(row.entry2 && { entry2: row.entry2 }),
    ...(row.entry3 && { entry3: row.entry3 }),
    mode_name: row.mode_name,
    category: row.category,
    ...(row.subcategory && { subcategory: row.subcategory }),
    ...(row.subsubcategory && { subsubcategory: row.subsubcategory }),
    updatedAt: date,
    createdAt: date,
  };
  return userSound;
}

export async function kompleteSqliteToMongo(
  sqlitePath: string,
  user: IUser,
): Promise<UpdateWriteOpResult[]> {
  const db: Database = new sqlite3(sqlitePath);

  try {
    const masterQuery = `SELECT
    k_sound_info.favorite_id,
    k_sound_info.version,
    k_sound_info.name,
    k_sound_info.author,
    k_sound_info.comment,
    k_sound_info.vendor,
    k_sound_info.color,
    k_sound_info.tempo,
    k_content_path.alias,
    k_content_path.product_id,
    k_content_path.product_version,
    k_bank_chain.bcvendor,
    k_bank_chain.entry1,
    k_bank_chain.entry2,
    k_bank_chain.entry3,
    k_mode.name AS mode_name,
    k_category.category,
    k_category.subcategory,
    k_category.subsubcategory
  FROM
    k_sound_info
    LEFT JOIN k_content_path ON k_sound_info.content_path_id = k_content_path.id
    LEFT JOIN k_bank_chain ON k_sound_info.bank_chain_id = k_bank_chain.id
    LEFT JOIN k_sound_info_mode ON k_sound_info.id = k_sound_info_mode.sound_info_id
    LEFT JOIN k_mode ON k_sound_info_mode.mode_id = k_mode.id
    LEFT JOIN k_sound_info_category ON k_sound_info.id = k_sound_info_category.sound_info_id
    LEFT JOIN k_category ON k_sound_info_category.category_id = k_category.id;`;
    const master = db.prepare(masterQuery).all() as object[];
    const upsertPromises: Promise<any>[] = [];
    // now we need to add updated_by and created_by to all the rows, assuming an upsert
    master.forEach((row: any) => {
      const rowInterface: IUserSound = rowToInterface(row, user);

      // Perform upsert
      const upsertPromise = UserSoundModel.updateOne(
        { user_id: user._id, favorite_id: row.favorite_id },
        rowInterface,
        { upsert: true },
      ).exec();
      upsertPromises.push(upsertPromise);
    });
    return await Promise.all(upsertPromises);
  } catch (err) {
    console.error('Error reading SQLite database:', err);
  } finally {
    db.close();
  }
  return [];
}
