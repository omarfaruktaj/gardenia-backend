import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

const middlewares = [
  cors({ credentials: true }),
  express.json(),
  cookieParser(),
  helmet(),
  morgan('tiny'),
];

export default middlewares;
