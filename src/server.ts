import app from "./app";
import { pool } from "./config/db";
import { envVars } from "./config/env";


const startServer = async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("Database connected successfully");

    app.listen(envVars.port, () => {
      console.log(`Server is running on port ${envVars.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();
