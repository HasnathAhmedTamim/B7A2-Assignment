export type UserRole = "contributor" | "maintainer";

export interface AuthUser {
  id: number;
  name: string;
  role: UserRole;
}
