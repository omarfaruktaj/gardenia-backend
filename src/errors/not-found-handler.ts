import { Request, Response } from 'express';

export default (_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'The requested resource could not be found.',
  });
};
