import express from 'express';
import notFoundHandler from '../errors/not-found-handler';
import globalErrorHandler from './global-error-handler';
import middlewares from './middlewares';
import routes from './routes';
import 'express-async-errors';

const app = express();

// Use middlewares
app.use(middlewares);

// Use routes
app.use('/api/v1', routes);

// Root route
app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to our server!',
  });
});

// Health check route
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running smoothly!',
  });
});

// Handle not found routes
app.use(notFoundHandler);

// Global error handler
app.use(globalErrorHandler);

export default app;
