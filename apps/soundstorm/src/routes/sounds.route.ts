import { Request, Response, Router } from 'express';
import { Schema } from 'mongoose';
import { validateAccessToken } from '../middlewares/auth0';
import { JwtService } from '../services/jwtService';
import { processFile, upload } from '../services/uploadService';
import {
  BaseModel,
  IUser,
  ModelName,
  UserSoundSchema,
} from '@soundstorm/soundstorm-lib';
import { User } from 'auth0';
import { existsSync, rmSync } from 'fs';

export const userSoundsRouter = Router();
const jwtService = new JwtService();
const UserFavoritesModel = BaseModel.getModel(ModelName.UserFavorite);
const UserSoundModel = BaseModel.getModel(ModelName.UserSound);

userSoundsRouter.post(
  '/upload',
  validateAccessToken,
  upload.single('file'),
  async (req: Request, res: Response) => {
    jwtService.authenticateUser(
      req,
      res,
      async (user: IUser, auth0User: User) => {
        const file: Express.Multer.File = req.file as Express.Multer.File;
        const clear = req.body.clear === 'true' || req.body.clear === true;
        if (file === undefined) {
          res.status(400).send('No file uploaded');
          return;
        }
        try {
          await processFile(req, res, user, file, clear);
          console.log('File uploaded successfully');
          res
            .status(200)
            .json({ message: 'File uploaded successfully', file: file });
        } catch (error) {
          if (existsSync(file.path)) {
            rmSync(file.path);
          }
          console.error('Error processing file:', error);
          res.status(500).json(error);
        }
      },
    );
  },
);

const getValidKeys = (schemaObj: Record<string, any>): string[] => {
  const excludeKeys = ['deletedAt', 'deletedBy', 'updatedAt', 'createdAt'];
  return Object.keys(schemaObj).filter((key) => !excludeKeys.includes(key));
};

type MatchStage = {
  user_id: Schema.Types.ObjectId;
  $or?: Record<string, any>[];
};

userSoundsRouter.get(
  '/',
  validateAccessToken,
  async (req: Request, res: Response) => {
    jwtService.authenticateUser(
      req,
      res,
      async (user: IUser, auth0User: User) => {
        try {
          // Extract query parameters
          const { limit, skip, favoritesOnly, ...queryParams } = req.query;

          // Get valid keys using the function
          const validKeys = getValidKeys(UserSoundSchema.obj);
          const orConditions = [];
          for (const key of validKeys) {
            if (queryParams[key]) {
              const condition = {};
              condition[key] = queryParams[key];
              orConditions.push(condition);
            }
          }

          const matchStage: MatchStage = {
            user_id: user._id,
          };

          if (orConditions.length > 0) {
            matchStage.$or = orConditions;
          }

          // Define fields to return
          const selectFields = {
            favorite_id: 1,
            alias: 1,
            name: 1,
            author: 1,
            category: 1,
          };

          // Define the aggregation pipeline
          const pipeline = [
            {
              $match: matchStage,
            },
            {
              $lookup: {
                from: 'userfavorites', // Name of the UserFavorites collection
                localField: 'favorite_id',
                foreignField: 'favorite_id',
                as: 'userFavorite',
              },
            },
            {
              $match: {
                $expr:
                  favoritesOnly === 'true'
                    ? { $ne: [{ $size: '$userFavorite' }, 0] }
                    : {},
              },
            },
            {
              $project: selectFields,
            },
            {
              $limit: Number(limit) || 10,
            },
            {
              $skip: Number(skip) || 0,
            },
          ];

          // Execute the aggregation pipeline
          const sounds = await UserSoundModel.aggregate(pipeline).exec();

          // Get a count of the sounds matching the query
          const soundCount =
            await UserSoundModel.countDocuments(matchStage).exec();

          // Return the fetched sounds
          res.status(200).json({
            count: sounds.length,
            limit: Number(limit) || 10,
            skip: Number(skip) || 0,
            sounds: sounds,
            total: soundCount,
          });
        } catch (error) {
          console.error('Error fetching sounds:', error);
          res
            .status(500)
            .json({ message: 'Error fetching sounds', error: error.message });
        }
      },
    );
  },
);

userSoundsRouter.get(
  '/:favorite_id',
  validateAccessToken,
  async (req: Request, res: Response) => {
    jwtService.authenticateUser(
      req,
      res,
      async (user: IUser, auth0User: User) => {
        try {
          // Extract query parameters
          const { favorite_id } = req.params;

          // Fetch sound based on the sanitized query
          const sound = await UserSoundModel.findOne({
            user_id: user._id,
            favorite_id: favorite_id,
          }).exec();

          // Return the fetched sound
          res.status(200).json(sound);
        } catch (error) {
          console.error('Error fetching sound:', error);
          res
            .status(500)
            .json({ message: 'Error fetching sound', error: error.message });
        }
      },
    );
  },
);

userSoundsRouter.post(
  '/:favorite_id/favorite',
  validateAccessToken,
  async (req: Request, res: Response) => {
    jwtService.authenticateUser(
      req,
      res,
      async (user: IUser, auth0User: User) => {
        try {
          const { favorite_id } = req.params;

          // Upsert the user's favorite sound
          const result = await UserFavoritesModel.updateOne(
            { user_id: user._id, favorite_id: favorite_id },
            { user_id: user._id, favorite_id: favorite_id },
            { upsert: true },
          ).exec();

          if (result.upsertedCount > 0) {
            res
              .status(200)
              .json({ message: 'Sound marked as favorite successfully.' });
          } else {
            res.status(200).json({ message: 'Sound was already a favorite.' });
          }
        } catch (error) {
          console.error('Error marking sound as favorite:', error);
          res.status(500).json({
            message: 'Error marking sound as favorite',
            error: error.message,
          });
        }
      },
    );
  },
);

userSoundsRouter.delete(
  '/:favorite_id/favorite',
  validateAccessToken,
  async (req: Request, res: Response) => {
    jwtService.authenticateUser(
      req,
      res,
      async (user: IUser, auth0User: User) => {
        try {
          const { favorite_id } = req.params;

          // delete from userfavorites
          const result = await UserFavoritesModel.deleteOne({
            user_id: user._id,
            favorite_id: favorite_id,
          }).exec();

          if (result.deletedCount > 0) {
            res
              .status(200)
              .json({ message: 'Sound removed from favorites successfully.' });
          } else {
            res.status(200).json({ message: 'Sound was not a favorite.' });
          }
        } catch (error) {
          console.error('Error removing sound from favorites:', error);
          res.status(500).json({
            message: 'Error removing sound from favorites',
            error: error.message,
          });
        }
      },
    );
  },
);

export default userSoundsRouter;
