import { type Request, type Response } from "express";

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    errors: null,
  });
};
