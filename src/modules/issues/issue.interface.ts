export type IssueType = "bug" | "feature_request";
export type IssueStatus = "open" | "in_progress" | "resolved";

export interface ICreateIssuePayload {
  title: string;
  description: string;
  type: IssueType;
}

export interface IIssue {
  id: number;
  title: string;
  description: string;
  type: IssueType;
  status: IssueStatus;
  reporter_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface IReporter {
  id: number;
  name: string;
  role: "contributor" | "maintainer";
}

export interface IIssueWithReporter {
  id: number;
  title: string;
  description: string;
  type: IssueType;
  status: IssueStatus;
  reporter: IReporter | null;
  created_at: Date;
  updated_at: Date;
}

export interface IGetIssuesQuery {
  sort?: "newest" | "oldest";
  type?: IssueType;
  status?: IssueStatus;
}
