import express, { type Request, type Response } from "express";
import cors from "cors";
import { globalErrorHandler } from "./middleware/globalErrorHandler.js";
import { notFound } from "./middleware/notFound.js";
import { AuthRoutes } from "./modules/auth/auth.route.js";
import { IssueRoutes } from "./modules/issues/issue.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("DevPulse API is running");
});

app.use("/api/auth", AuthRoutes);
app.use("/api/issues", IssueRoutes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
