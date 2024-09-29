interface Errors {
  path: string;
  message: string;
}

class AppError extends Error {
  public readonly status: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errors?: Errors[];

  constructor(message: string, statusCode: number, errors?: Errors[]) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.errors = errors;
    this.isOperational = true;

    Error.captureStackTrace(this);
  }
}

export default AppError;
