import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env

export class Connection {
  private static pool: Pool; // Singleton connection pool

  constructor() {
    // console.log('DB_USER:', process.env.DB_USER);
    // console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
    // console.log('DB_HOST:', process.env.DB_HOST);
    // console.log('DB_NAME:', process.env.DB_NAME);
    // console.log('DB_PORT:', process.env.DB_PORT);
  }

  async getConnection() {
    // create connection Only once

    if (!Connection.pool) {
      let result = await this.connectDB();
      if (!result) {
        return false;
      }
    }
    return Connection.pool;
  }

  // Function to connect to the database
  async connectDB() {
    try {
      Connection.pool = new Pool({
        connectionString: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
      });
      const result = await Connection.pool.connect(); // Establish a connection
      console.log("RESULT###", result);
      console.log("Connected to Database");
      return result;
    } catch (error) {
      console.error("Error connecting to the database:", error);

      return false;
    }
  }
}
