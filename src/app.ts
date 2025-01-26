import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
const app: Application = express();
// parser
app.use(express.json());
app.use(cors());

// application routes
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('👋 Hello From Gearly E-Commerce Server!');
});

app.get('/test-error', (req, res, next) => {
  const err = new Error('This is a test error');
  next(err);
});

// not found route
app.use(notFound);

// global error handler
app.use(globalErrorHandler);

export default app;
