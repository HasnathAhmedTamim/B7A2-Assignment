import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { pool } from "../../config/db.js";
import config from "../../config/env.js";
import { AppError } from "../../utils/AppError.js";
import {
  type ISignupPayload,
  type ILoginPayload,
  type IUserResponse,
  type IUserWithPassword,
} from "./auth.interface.js";
import { validateSignupPayload, validateLoginPayload } from "./auth.validation.js";
import { createToken } from "./auth.utils.js";
import { MESSAGES } from "../../constants/messages.js";
// Service function to handle user signup
const signupUser = async (payload: ISignupPayload): Promise<IUserResponse> => {
  validateSignupPayload(payload);

  const { name, email, password, role = "contributor" } = payload;

  //   Check if the email already exists in the database
  const existingUser = await pool.query(
    `SELECT id FROM users WHERE email = $1`,
    [email],
  );

  if (existingUser.rows.length > 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, MESSAGES.AUTH.EMAIL_EXISTS);
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
      MESSAGES.AUTH.FAILED_CREATE,
    );
  }

  return createdUser;
};
// Service function to handle user login
const loginUser = async (payload: ILoginPayload) => {
  validateLoginPayload(payload);

  const { email, password } = payload;

//   Check if the user exists in the database
  const result = await pool.query<IUserWithPassword>(
    `
    SELECT id, name, email, password, role, created_at, updated_at
    FROM users
    WHERE email = $1
    `,
    [email],
  );

  const user = result.rows[0];

  if (!user) {
    throw new AppError(StatusCodes.UNAUTHORIZED, MESSAGES.AUTH.INVALID_CREDENTIALS);
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new AppError(StatusCodes.UNAUTHORIZED, MESSAGES.AUTH.INVALID_CREDENTIALS);
  }

  const token = createToken({
    id: user.id,
    name: user.name,
    role: user.role,
  });

  const userWithoutPassword: IUserResponse = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };

  return {
    token,
    user: userWithoutPassword,
  };
};

export const AuthService = {
  signupUser,
  loginUser,
};
