import { Router } from 'express';
import usersRouter from './users.route';
import soundsRouter from './sounds.route';

export const apiRouter = Router();

apiRouter.use('/users', usersRouter);
apiRouter.use('/sounds', soundsRouter);

export default apiRouter;
