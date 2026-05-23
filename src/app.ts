import express, { type Request, type Response } from "express";
import cors from "cors";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { notFound } from "./middleware/notFound";
import { AuthRoutes } from "./modules/auth/auth.route";
import { IssueRoutes } from "./modules/issues/issue.route";

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
