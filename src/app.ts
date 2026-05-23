import express, { type Request, type Response } from "express";
import cors from "cors";
import { notFound } from "./middleware/notFound";
import { globalErrorHandler } from "./middleware/globalErrorHandler";


const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// health check route
app.get("/", (req: Request, res: Response) => {
  res.send("DevPulse API is running");
});



// not found and global error handler
app.use(notFound);
app.use(globalErrorHandler);

export default app;
