import cors from 'cors';
import helmet from 'helmet';
import express from 'express';

const middlewares = [cors(), helmet(), express()];

export default middlewares;
