export const MESSAGES = {
  AUTH: {
    USER_REGISTERED: "User registered successfully",
    LOGIN_SUCCESS: "Login successful",
    EMAIL_EXISTS: "Email already exists",
    INVALID_CREDENTIALS: "Invalid email or password",
    UNAUTHORIZED: "Unauthorized access",
    INVALID_TOKEN: "Invalid or expired token",
  },

  ISSUE: {
    CREATED: "Issue created successfully",
    UPDATED: "Issue updated successfully",
    DELETED: "Issue deleted successfully",
    NOT_FOUND: "Issue not found",
    REPORTER_NOT_FOUND: "Reporter not found",
    FAILED_CREATE: "Failed to create issue",
    FAILED_UPDATE: "Failed to update issue",
    ONLY_MAINTAINER_DELETE: "Only maintainer can delete issue",
    UPDATE_OWN_ONLY: "You can update only your own issue",
    ONLY_OPEN_UPDATE: "Only open issues can be updated by contributor",
    CONTRIBUTOR_STATUS_FORBIDDEN: "Contributor cannot update issue status",
  },

  VALIDATION: {
    NAME_REQUIRED: "Name is required",
    VALID_EMAIL_REQUIRED: "Valid email is required",
    PASSWORD_REQUIRED: "Password is required",
    PASSWORD_MIN: "Password must be at least 6 characters long",
    ROLE_INVALID: "Role must be contributor or maintainer",
    TITLE_REQUIRED: "Title is required",
    TITLE_MAX: "Title must not exceed 150 characters",
    DESCRIPTION_REQUIRED: "Description is required",
    DESCRIPTION_MIN: "Description must be at least 20 characters long",
    TYPE_INVALID: "Type must be bug or feature_request",
    STATUS_INVALID: "Status must be open, in_progress, or resolved",
    SORT_INVALID: "Sort must be newest or oldest",
    INVALID_ISSUE_ID: "Invalid issue id",
    UPDATE_FIELD_REQUIRED: "At least one field is required for update",
  },

  COMMON: {
    ROUTE_NOT_FOUND: "API route not found",
    SOMETHING_WENT_WRONG: "Something went wrong",
  },
} as const;
