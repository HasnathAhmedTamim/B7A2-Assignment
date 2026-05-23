import { AppError } from "../../utils/AppError";
import { type ISignupPayload } from "./auth.interface";

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validateSignupPayload = (payload: ISignupPayload) => {
  const { name, email, password, role } = payload;

  if (!name || typeof name !== "string") {
    throw new AppError(400, "Name is required");
  }

  if (!email || typeof email !== "string" || !isValidEmail(email)) {
    throw new AppError(400, "Valid email is required");
  }

  if (!password || typeof password !== "string") {
    throw new AppError(400, "Password is required");
  }

  if (password.length < 6) {
    throw new AppError(400, "Password must be at least 6 characters long");
  }

  if (role && role !== "contributor" && role !== "maintainer") {
    throw new AppError(400, "Role must be contributor or maintainer");
  }
};
