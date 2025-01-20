import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}

/**
 * 1 - Type Augmentation With declare global.
 * declare global allows us to modify or add properties to types from external libraries like express.
 * Express namespace is declared because Request belongs to it.
 * 2 - Extending The Request Interface
 * interface Request inside express adds a new user property of type JwtPayload from json web token.
 * 3 - Type Safety
 * With this declaration, TypeScript will not throw errors when accessing req.user. It also provides autocompletion and type checking for properties in JwtPayload.
 */
