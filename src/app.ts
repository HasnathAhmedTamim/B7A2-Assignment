import express, { type Request, type Response } from "express";
import cors from "cors";
import { globalErrorHandler } from "./middleware/globalErrorHandler.js";
import { notFound } from "./middleware/notFound.js";
import { AuthRoutes } from "./modules/auth/auth.route.js";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// health check route
app.get("/", (req: Request, res: Response) => {
  res.send("DevPulse API is running");
});

// routes
app.use("/api/auth", AuthRoutes);

// not found and global error handler
app.use(notFound);
app.use(globalErrorHandler);

export default app;
