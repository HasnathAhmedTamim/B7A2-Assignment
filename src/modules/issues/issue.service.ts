import { StatusCodes } from "http-status-codes";
import { pool } from "../../config/db";
import { AppError } from "../../utils/AppError";
import {
  type ICreateIssuePayload,
  type IIssue,
  type IGetIssuesQuery,
  type IReporter,
  type IIssueWithReporter,
} from "./issue.interface";
import {
  validateCreateIssuePayload,
  validateGetIssuesQuery,
} from "./issue.validation";

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

export const IssueService = {
  createIssue,
  getAllIssues,
};
