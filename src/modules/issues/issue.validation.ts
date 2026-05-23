import { AppError } from "../../utils/AppError";
import {
  type ICreateIssuePayload,
  type IGetIssuesQuery,
} from "./issue.interface";

export const validateCreateIssuePayload = (payload: ICreateIssuePayload) => {
  const { title, description, type } = payload;

  if (!title || typeof title !== "string") {
    throw new AppError(400, "Title is required");
  }

  if (title.length > 150) {
    throw new AppError(400, "Title must not exceed 150 characters");
  }

  if (!description || typeof description !== "string") {
    throw new AppError(400, "Description is required");
  }

  if (description.length < 20) {
    throw new AppError(400, "Description must be at least 20 characters long");
  }

  if (type !== "bug" && type !== "feature_request") {
    throw new AppError(400, "Type must be bug or feature_request");
  }
};

export const validateGetIssuesQuery = (query: IGetIssuesQuery) => {
  const { sort, type, status } = query;

  if (sort && sort !== "newest" && sort !== "oldest") {
    throw new AppError(400, "Sort must be newest or oldest");
  }

  if (type && type !== "bug" && type !== "feature_request") {
    throw new AppError(400, "Type must be bug or feature_request");
  }

  if (
    status &&
    status !== "open" &&
    status !== "in_progress" &&
    status !== "resolved"
  ) {
    throw new AppError(400, "Status must be open, in_progress, or resolved");
  }
};
