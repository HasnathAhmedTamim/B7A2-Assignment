import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { pool } from "../../config/db";
import config from "../../config/env";
import { AppError } from "../../utils/AppError";
import { type ISignupPayload, type IUserResponse } from "./auth.interface";
import { validateSignupPayload } from "./auth.validation";

// Service function to handle user signup
const signupUser = async (payload: ISignupPayload): Promise<IUserResponse> => {
  validateSignupPayload(payload);

  const { name, email, password, role = "contributor" } = payload;

  const existingUser = await pool.query(
    `SELECT id FROM users WHERE email = $1`,
    [email],
  );

  if (existingUser.rows.length > 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, config.bcryptSaltRounds);

//   Insert the new user into the database and return the created user
  const result = await pool.query<IUserResponse>(
    `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, role, created_at, updated_at
    `,
    [name, email, hashedPassword, role],
  );

  const createdUser = result.rows[0];

  if (!createdUser) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to create user",
    );
  }

  return createdUser;
};

export const AuthService = {
  signupUser,
};
