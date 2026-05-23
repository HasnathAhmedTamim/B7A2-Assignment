import { AppError } from "../../utils/AppError.js";
import {
  type ICreateIssuePayload,
  type IGetIssuesQuery,
  type IUpdateIssuePayload,
} from "./issue.interface.js";

import { MESSAGES } from "../../constants/messages.js";
export const validateCreateIssuePayload = (payload: ICreateIssuePayload) => {
  const { title, description, type } = payload;

  if (!title || typeof title !== "string") {
    throw new AppError(400, MESSAGES.VALIDATION.TITLE_REQUIRED);
  }

  if (title.length > 150) {
    throw new AppError(400, MESSAGES.VALIDATION.TITLE_MAX_LENGTH);
  }

  if (!description || typeof description !== "string") {
    throw new AppError(400, MESSAGES.VALIDATION.DESCRIPTION_REQUIRED);
  }

  if (description.length < 20) {
    throw new AppError(400, MESSAGES.VALIDATION.DESCRIPTION_MIN_LENGTH);
  }

  if (type !== "bug" && type !== "feature_request") {
    throw new AppError(400, MESSAGES.VALIDATION.TYPE_INVALID);
  }
};

export const validateGetIssuesQuery = (query: IGetIssuesQuery) => {
  const { sort, type, status } = query;

  if (sort && sort !== "newest" && sort !== "oldest") {
    throw new AppError(400, MESSAGES.VALIDATION.SORT_INVALID);
  }

  if (type && type !== "bug" && type !== "feature_request") {
    throw new AppError(400, MESSAGES.VALIDATION.TYPE_INVALID);
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

export const validateUpdateIssuePayload = (payload: IUpdateIssuePayload) => {
  const { title, description, type, status } = payload;

  if (
    title === undefined &&
    description === undefined &&
    type === undefined &&
    status === undefined
  ) {
    throw new AppError(400, MESSAGES.VALIDATION.UPDATE_FIELD_REQUIRED);
  }

  if (title !== undefined) {
    if (typeof title !== "string") {
      throw new AppError(400, MESSAGES.VALIDATION.TITLE_STRING);
    }

    if (title.length > 150) {
      throw new AppError(400, MESSAGES.VALIDATION.TITLE_MAX_LENGTH);
    }
  }

  if (description !== undefined) {
    if (typeof description !== "string") {
      throw new AppError(400, MESSAGES.VALIDATION.DESCRIPTION_STRING);
    }

    if (description.length < 20) {
      throw new AppError(
        400,
        MESSAGES.VALIDATION.DESCRIPTION_MIN_LENGTH,
      );
    }
  }

  if (type !== undefined && type !== "bug" && type !== "feature_request") {
    throw new AppError(400, MESSAGES.VALIDATION.TYPE_INVALID);
  }

  if (
    status !== undefined &&
    status !== "open" &&
    status !== "in_progress" &&
    status !== "resolved"
  ) {
    throw new AppError(400, MESSAGES.VALIDATION.STATUS_INVALID);
  }
};
