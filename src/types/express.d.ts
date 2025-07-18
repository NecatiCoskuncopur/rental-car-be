import { JwtPayload } from 'src/common/guards/auth.guard';

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}
