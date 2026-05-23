import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || "5000",
  connectionString: process.env.CONNECTION_STRING as string,

  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
};

export default config;
