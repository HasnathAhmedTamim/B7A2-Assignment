import express, { type Request, type Response } from "express";
import cors from "cors";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// health check route
app.get("/", (req: Request, res: Response) => {
  res.send("DevPulse API is running");
});

export default app;
