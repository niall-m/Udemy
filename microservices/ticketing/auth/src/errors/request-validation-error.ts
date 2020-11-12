import { ValidationError } from 'express-validator';

export class RequestValidationError extends Error {
  constructor(public errors: ValidationError[]) {
    super();

    // because we're extending a built in class (Error)
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
}