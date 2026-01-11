import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Application, type Request, type Response } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
const app: Application = express();
// parser
app.use(express.json());
app.use(cookieParser());

// allowed origins
const allowedOrigins = ['http://localhost:5173', 'https://gearly-e-commerce.netlify.app'];
app.use(
	cors({
		origin: allowedOrigins,
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
	}),
);

// application routes
app.use('/api/v1', router);

app.get('/', (_req: Request, res: Response) => {
	res.send('👋 Hello From Gearly E-Commerce Server! Find Your Products');
});

app.get('/test-error', (_req, _res, next) => {
	const err = new Error('This is a test error');
	next(err);
});

// not found route
app.use(notFound);

// global error handler
app.use(globalErrorHandler);

export default app;
