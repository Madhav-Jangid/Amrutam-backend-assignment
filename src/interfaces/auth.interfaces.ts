export interface UserPayload {
  id: string;
  email: string;
  roles: string[];
  permissions: string[];
}

import 'express';
declare module 'express' {
  interface Request {
    user?: UserPayload;
  }
}
