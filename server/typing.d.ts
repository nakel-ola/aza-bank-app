import type { Request, Response } from "express";

export interface ContextType {
  req: Request;
  res: Response;
}
