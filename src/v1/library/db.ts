import { Pool } from "pg";
import { Connection } from "./connection";

export class Db {
  public pool: Pool | boolean = false;
  public query: string = "";
  public table: string = "";
  public where: string = "";
  public orderby: string = "";
  public limit: string = "";
  public join: string = "";
  public uniqueField: string = "";
  public ppp: number = 20;
  public page: number = 1;

  constructor() {}

  async executeQuery(query: string) {
    this.query = query;
    let connectionObj = new Connection();
    try {
      const pool = await connectionObj.getConnection();
      if (!pool) {
        console.error("Failed to get the database connection pool.");
        return;
      }
      this.pool = pool;
      const result = await this.pool.query(query);
      console.log("Query RESULT###", result);
      if (!result) {
        return false;
      }

      if (result.command === "SELECT") {
        return result.rows;
      } else {
        console.log("Befor Else part is executed##", result.rows[0]);

        return result.rows[0];
      }
    } catch (error) {
      console.error("Error executing query:", error);
      return false;
    }
  }

  //select
  select(
    table: string,

    where: string = "",
    orderby: string = "",
    limit: string = "",
    fields: string = "*"
  ) {
    let query =
      "SELECT " +
      fields +
      " FROM " +
      table +
      " " +
      where +
      " " +
      orderby +
      " " +
      limit;
    console.log("Query**", query);
    return this.executeQuery(query);
  }
  //insert
  insert(table: string, data: any) {
    let columnsArrays: any[] = [];
    let valuesArray: any[] = [];

    for (let key in data) {
      columnsArrays.push(key);
      const value = data[key];

      if (typeof value === "string") {
        // Wrap strings in single quotes and escape any single quotes within the string
        const escapedValue = value.replace(/'/g, "''");
        valuesArray.push(`'${escapedValue}'`);
      } else if (value === null) {
        valuesArray.push(`NULL`);
      } else {
        valuesArray.push(value);
      }
    }

    let columns: string = columnsArrays.join(",");

    let values: string = valuesArray.join(",");
    console.log("COLUMNS##", columns);
    console.log("VALUES##", values);

    let query =
      "INSERT INTO " +
      table +
      " " +
      "(" +
      columns +
      ") VALUES (" +
      values +
      ")  RETURNING *";
    console.log("Generated Query:", query); // For debugging
    return this.executeQuery(query);
  }

  //update
  update(table: string, where: string, data: any) {
    let updatedString: string = "";

    for (let key in data) {
      if (updatedString != "") {
        updatedString += ",";
      }
      updatedString += key + "='" + data[key].replace(/'/g, "''") + "'";
    }

    let query =
      "UPDATE " + table + " SET " + updatedString + where + " RETURNING *";
    console.log("Generated Query:", query); // For debugging
    return this.executeQuery(query);
  }

  //delete
  delete(table: string, where: string) {
    let query = "DELETE FROM " + table + " " + where + " RETURNING *";
    return this.executeQuery(query);
  }

  //calc -->Avg

  async selectAvg(table: string, uniqueField: string, where: string) {
    let query: string = `SELECT AVG(${uniqueField}) AS avg FROM ${table}  ${where}`;
    let result = await this.executeQuery(query);
    return result.rows[0].avg;
  }

  async listRecords() {
    let start = (this.page - 1) * this.ppp;
    this.limit = "LIMIT " + this.ppp + " OFFSET " + start;
    let result: any[] = await this.select(
      this.table,
      this.where,
      this.orderby,
      this.limit
    );
    return result;
  }

  async selectJoin(fields = "*") {
    let query =
      "SELECT " +
      fields +
      "FROM " +
      this.table +
      " " +
      this.join +
      " " +
      this.where;
    let result: any[] = await this.executeQuery(query);
    return result;
  }
}
