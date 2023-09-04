import express from 'express';
import { environment } from './environment';
import apiRouter from './routes/api.route';

export function setupRoutes(app: express.Application) {
  app.use('/', express.static(environment.developer.reactDir));
  app.use('/api', apiRouter);
  // fallback to index.html for anything unknown
  app.get('*', (req, res) => {
    res.sendFile('index.html', { root: environment.developer.reactDir });
  });
}
