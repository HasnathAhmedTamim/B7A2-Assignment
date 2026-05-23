import app from "./app.js";
import config from "./config/env.js";
import { pool } from "./config/db.js";
import { initDB } from "./db/index.js";

const startServer = async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("Database connected successfully");

    await initDB();

    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();
