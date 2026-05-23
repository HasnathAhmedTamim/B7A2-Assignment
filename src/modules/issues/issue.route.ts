import { Router } from "express";
import { auth } from "../../middleware/auth.middleware";
import { IssueController } from "./issue.controller";

const router = Router();

router.post("/", auth, IssueController.createIssue);
router.get("/", IssueController.getAllIssues);
export const IssueRoutes = router;
