import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { userRoutes } from './app/modules/user/user.routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
const app: Application = express();
// parser
app.use(express.json());
app.use(cors());

// application routes
app.use('/api/v1', userRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('👋 Hello From Gearly E-Commerce Server!');
});

// global error handler
app.use(globalErrorHandler);
export default app;
