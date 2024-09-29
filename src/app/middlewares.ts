import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

const middlewares = [cors(), helmet(), morgan('tiny'), express.json()];

export default middlewares;
