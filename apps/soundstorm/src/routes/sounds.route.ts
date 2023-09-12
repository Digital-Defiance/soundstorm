import { Request, Response, Router } from 'express';
import { validateAccessToken } from '../middlewares/auth0';
import { JwtService } from '../services/jwtService';
import { processFile, upload } from '../services/uploadService';
import { IUser } from '@soundstorm/soundstorm-lib';
import { User } from 'auth0';

export const userSoundsRouter = Router();
const jwtService = new JwtService();

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
        await processFile(user, file, req, res);
        res
          .status(200)
          .json({ message: 'File uploaded successfully', file: file });
      },
    );
  },
);

export default userSoundsRouter;
