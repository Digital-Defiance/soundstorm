import express from 'express';
import bodyParser from 'body-parser';
import authRouter from './routers/auth';
import { connectDb, loadModels } from './mongoose';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', authRouter);

connectDb().then(() => {
  loadModels();
  app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}`);
  });
});