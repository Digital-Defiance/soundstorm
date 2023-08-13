import express from 'express';
import bodyParser from 'body-parser';
import { join } from 'path';
import authRouter from './routers/auth';
import { connectDb, loadModels } from './mongoose';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', authRouter);

const reactAppPath = join(__dirname, '../../../../soundstorm-react');

app.use(express.static(reactAppPath));

app.get('*', (req, res) => {
  res.sendFile(join(reactAppPath, 'index.html'));
});


connectDb().then(() => {
  loadModels();
  app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}`);
  });
});