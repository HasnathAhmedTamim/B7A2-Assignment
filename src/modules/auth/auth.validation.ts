import { AppError } from "../../utils/AppError.js";
import { type ISignupPayload, type ILoginPayload } from "./auth.interface";
import { MESSAGES } from "../../constants/messages.js";
const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validateSignupPayload = (payload: ISignupPayload) => {
  const { name, email, password, role } = payload;

  if (!name || typeof name !== "string") {
    throw new AppError(400, MESSAGES.VALIDATION.NAME_REQUIRED);
  }

  if (!email || typeof email !== "string" || !isValidEmail(email)) {
    throw new AppError(400, MESSAGES.VALIDATION.VALID_EMAIL_REQUIRED);
  }

  if (!password || typeof password !== "string") {
    throw new AppError(400, MESSAGES.VALIDATION.PASSWORD_REQUIRED);
  }

  if (password.length < 6) {
    throw new AppError(400, MESSAGES.VALIDATION.PASSWORD_MIN_LENGTH);
  }

  if (role && role !== "contributor" && role !== "maintainer") {
    throw new AppError(400, MESSAGES.VALIDATION.ROLE_INVALID);
  }
};

export const validateLoginPayload = (payload: ILoginPayload) => {
  const { email, password } = payload;

  if (!email || typeof email !== "string" || !isValidEmail(email)) {
    throw new AppError(400, MESSAGES.VALIDATION.VALID_EMAIL_REQUIRED);
  }

  if (!password || typeof password !== "string") {
    throw new AppError(400, MESSAGES.VALIDATION.PASSWORD_REQUIRED);
  }
};
