import { StatusCodes } from "http-status-codes";
import { AppError } from "../../utils/AppError.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { IssueService } from "./issue.service.js";
import { type IGetIssuesQuery } from "./issue.interface.js";
import { MESSAGES } from "../../constants/messages.js";

const createIssue = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(StatusCodes.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED);
  }

  const issue = await IssueService.createIssue(req.body, req.user.id);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: MESSAGES.ISSUE.CREATED,
    data: issue,
  });
});

const getAllIssues = catchAsync(async (req, res) => {
  const query = req.query as IGetIssuesQuery;

  const issues = await IssueService.getAllIssues(query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    data: issues,
  });
});

const getSingleIssue = catchAsync(async (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    throw new AppError(StatusCodes.BAD_REQUEST, MESSAGES.ISSUE.INVALID_ISSUE_ID);
  }

  const issue = await IssueService.getSingleIssue(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    data: issue,
  });
});

const updateIssue = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(StatusCodes.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED);
  }

  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    throw new AppError(StatusCodes.BAD_REQUEST, MESSAGES.ISSUE.INVALID_ISSUE_ID);
  }

  const issue = await IssueService.updateIssue(id, req.body, req.user);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: MESSAGES.ISSUE.UPDATED,
    data: issue,
  });
});

const deleteIssue = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(StatusCodes.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED);
  }

  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    throw new AppError(StatusCodes.BAD_REQUEST, MESSAGES.ISSUE.INVALID_ISSUE_ID);
  }

  await IssueService.deleteIssue(id, req.user);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: MESSAGES.ISSUE.DELETED,
  });
});

export const IssueController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};
