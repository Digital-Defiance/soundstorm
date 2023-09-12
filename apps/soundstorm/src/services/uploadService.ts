import { Request, Response } from 'express';
import { diskStorage } from 'multer';
import { existsSync, copyFileSync, renameSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';
import { randomBytes } from 'crypto';
import multer from 'multer';
import { kompleteSqliteToMongo } from './sqliteMongoService';
import { environment } from '../environment';
import { IUser, IUserSound } from '@soundstorm/soundstorm-lib';
import { BulkWriteResult } from 'mongodb';

export const storage = diskStorage({
  destination: (req, file, cb) => {
    if (!existsSync(environment.developer.uploadDir)) {
      mkdirSync(environment.developer.uploadDir, { recursive: true });
    }
    cb(null, environment.developer.uploadDir + '/');
  },
  filename: (req, file, cb) => {
    // Use crypto to generate a random filename
    const randomName = randomBytes(16).toString('hex');
    cb(null, `_${randomName}.db3`);
  },
});

export const upload = multer({ storage });

export async function processFile(
  user: IUser,
  file: Express.Multer.File,
  req: Request,
  res: Response,
): Promise<BulkWriteResult | undefined> {
  console.log(`Uploaded file: ${file.originalname} (${file.size} bytes)`);
  console.log(`  mimetype: ${file.mimetype}`);

  // make sure filename is komplete.db3
  if (file.originalname !== 'komplete.db3') {
    res.status(400).send('Invalid file uploaded');
    return undefined;
  }

  if (
    file.mimetype !== 'application/x-sqlite3' &&
    file.mimetype !== 'application/octet-stream'
  ) {
    console.warn(
      `WARNING: mimetype is ${file.mimetype} instead of application/x-sqlite3 or application/octet-stream`,
    );
  }

  if (!existsSync(file.path)) {
    res.status(500).send('File not found');
    return undefined;
  }

  const userFilename = join(environment.developer.uploadDir, `${user._id}.db3`);
  const result = await kompleteSqliteToMongo(file.path, user);
  if (result && result.modifiedCount > 0) {
    // keep only the latest table
    if (existsSync(userFilename)) {
      console.log(`removing old file ${userFilename}`);
      rmSync(userFilename);
    }
    console.log(`renaming ${file.path} to ${userFilename}`);
    renameSync(file.path, userFilename);
    console.log('returning', result);
    return result;
  }
  return undefined;
}
