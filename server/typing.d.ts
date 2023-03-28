import type { IncomingMessage, ServerResponse } from "http";

export interface Context {
  user?: User | null;
  req: IncomingMessage;
  res: ServerResponse;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  balance: string;
  phoneNumber: string;
  accountNumber: number;
  photoUrl?: string;
}
