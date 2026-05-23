import { StatusCodes } from "http-status-codes";
import { pool } from "../../config/db";
import { AppError } from "../../utils/AppError";
import {
  type ICreateIssuePayload,
  type IIssue,
  type IGetIssuesQuery,
  type IReporter,
  type IIssueWithReporter,
  type IUpdateIssuePayload,
} from "./issue.interface";
import {
  validateCreateIssuePayload,
  validateGetIssuesQuery,
  validateUpdateIssuePayload,
} from "./issue.validation";
import { type AuthUser } from "../../types/auth";
const createIssue = async (
  payload: ICreateIssuePayload,
  reporterId: number,
): Promise<IIssue> => {
  validateCreateIssuePayload(payload);

  const { title, description, type } = payload;

  const reporterResult = await pool.query(
    `SELECT id FROM users WHERE id = $1`,
    [reporterId],
  );

  if (reporterResult.rows.length === 0) {
    throw new AppError(StatusCodes.NOT_FOUND, "Reporter not found");
  }

  const result = await pool.query<IIssue>(
    `
    INSERT INTO issues (title, description, type, reporter_id)
    VALUES ($1, $2, $3, $4)
    RETURNING id, title, description, type, status, reporter_id, created_at, updated_at
    `,
    [title, description, type, reporterId],
  );

  const issue = result.rows[0];

  if (!issue) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to create issue",
    );
  }

  return issue;
};

const getAllIssues = async (
  query: IGetIssuesQuery,
): Promise<IIssueWithReporter[]> => {
  validateGetIssuesQuery(query);

  const { sort = "newest", type, status } = query;

  let sql = `
    SELECT id, title, description, type, status, reporter_id, created_at, updated_at
    FROM issues
  `;

  const conditions: string[] = [];
  const values: string[] = [];

  if (type) {
    values.push(type);
    conditions.push(`type = $${values.length}`);
  }

  if (status) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }

  sql +=
    sort === "oldest"
      ? ` ORDER BY created_at ASC`
      : ` ORDER BY created_at DESC`;

  const issueResult = await pool.query<IIssue>(sql, values);
  const issues = issueResult.rows;

  if (issues.length === 0) {
    return [];
  }

  const reporterIds = [...new Set(issues.map((issue) => issue.reporter_id))];

  const reporterResult = await pool.query<IReporter>(
    `
    SELECT id, name, role
    FROM users
    WHERE id = ANY($1::int[])
    `,
    [reporterIds],
  );

  const reporters = reporterResult.rows;

  const issuesWithReporter = issues.map((issue) => {
    const reporter =
      reporters.find((user) => user.id === issue.reporter_id) || null;

    return {
      id: issue.id,
      title: issue.title,
      description: issue.description,
      type: issue.type,
      status: issue.status,
      reporter,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
    };
  });

  return issuesWithReporter;
};

const getSingleIssue = async (id: number): Promise<IIssueWithReporter> => {
  const issueResult = await pool.query<IIssue>(
    `
    SELECT id, title, description, type, status, reporter_id, created_at, updated_at
    FROM issues
    WHERE id = $1
    `,
    [id],
  );

  const issue = issueResult.rows[0];

  if (!issue) {
    throw new AppError(StatusCodes.NOT_FOUND, "Issue not found");
  }

  const reporterResult = await pool.query<IReporter>(
    `
    SELECT id, name, role
    FROM users
    WHERE id = $1
    `,
    [issue.reporter_id],
  );

  const reporter = reporterResult.rows[0] || null;

  return {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter,
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };
};

const updateIssue = async (
  id: number,
  payload: IUpdateIssuePayload,
  user: AuthUser,
): Promise<IIssue> => {
  validateUpdateIssuePayload(payload);

  const issueResult = await pool.query<IIssue>(
    `
    SELECT id, title, description, type, status, reporter_id, created_at, updated_at
    FROM issues
    WHERE id = $1
    `,
    [id],
  );

  const issue = issueResult.rows[0];

  if (!issue) {
    throw new AppError(StatusCodes.NOT_FOUND, "Issue not found");
  }

  const isMaintainer = user.role === "maintainer";
  const isOwner = issue.reporter_id === user.id;

  if (!isMaintainer) {
    if (!isOwner) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "You can update only your own issue",
      );
    }

    if (issue.status !== "open") {
      throw new AppError(
        StatusCodes.CONFLICT,
        "Only open issues can be updated by contributor",
      );
    }

    if (payload.status !== undefined) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "Contributor cannot update issue status",
      );
    }
  }

  const updatedTitle = payload.title ?? issue.title;
  const updatedDescription = payload.description ?? issue.description;
  const updatedType = payload.type ?? issue.type;
  const updatedStatus = payload.status ?? issue.status;

  const updatedResult = await pool.query<IIssue>(
    `
    UPDATE issues
    SET title = $1,
        description = $2,
        type = $3,
        status = $4,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $5
    RETURNING id, title, description, type, status, reporter_id, created_at, updated_at
    `,
    [updatedTitle, updatedDescription, updatedType, updatedStatus, id],
  );

  const updatedIssue = updatedResult.rows[0];

  if (!updatedIssue) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to update issue",
    );
  }

  return updatedIssue;
};

const deleteIssue = async (id: number, user: AuthUser): Promise<void> => {
  if (user.role !== "maintainer") {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "Only maintainer can delete issue",
    );
  }

  const issueResult = await pool.query<IIssue>(
    `
    SELECT id, title, description, type, status, reporter_id, created_at, updated_at
    FROM issues
    WHERE id = $1
    `,
    [id],
  );

  const issue = issueResult.rows[0];

  if (!issue) {
    throw new AppError(StatusCodes.NOT_FOUND, "Issue not found");
  }

  await pool.query(
    `
    DELETE FROM issues
    WHERE id = $1
    `,
    [id],
  );
};

export const IssueService = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};
