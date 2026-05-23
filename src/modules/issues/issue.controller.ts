import { StatusCodes } from "http-status-codes";
import { AppError } from "../../utils/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { IssueService } from "./issue.service";
import { type IGetIssuesQuery } from "./issue.interface";

const createIssue = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized access");
  }

  const issue = await IssueService.createIssue(req.body, req.user.id);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Issue created successfully",
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
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid issue id");
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
    throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized access");
  }

  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid issue id");
  }

  const issue = await IssueService.updateIssue(id, req.body, req.user);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Issue updated successfully",
    data: issue,
  });
});

const deleteIssue = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized access");
  }

  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid issue id");
  }

  await IssueService.deleteIssue(id, req.user);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Issue deleted successfully",
  });
});

export const IssueController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};
