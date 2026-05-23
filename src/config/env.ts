import dotenv from "dotenv";

dotenv.config();

export const envVars = {
  port: process.env.PORT || "5000",

  databaseUrl: process.env.CONNECTION_STRING as string,

  jwt: {
    secret: process.env.JWT_SECRET as string,
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },

  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
};
