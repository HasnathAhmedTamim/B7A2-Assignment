import { Router } from "express";
import { auth } from "../../middleware/auth.middleware.js";
import { IssueController } from "./issue.controller.js";

const router = Router();

router.post("/", auth, IssueController.createIssue);
router.get("/", IssueController.getAllIssues);
router.get("/:id", IssueController.getSingleIssue);
router.patch("/:id", auth, IssueController.updateIssue);
router.delete("/:id", auth, IssueController.deleteIssue);
export const IssueRoutes = router;
