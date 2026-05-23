import jwt, { type SignOptions } from "jsonwebtoken";
import config from "../../config/env.js";
import { type UserRole } from "./auth.interface.js";

type TJwtPayload = {
  id: number;
  name: string;
  role: UserRole;
};

export const createToken = (payload: TJwtPayload) => {
  const expiresIn = config.jwtExpiresIn as NonNullable<
    SignOptions["expiresIn"]
  >;

  return jwt.sign(payload, config.jwtSecret, {
    expiresIn,
  });
};
