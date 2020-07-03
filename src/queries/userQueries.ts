import { sql } from "../sql";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import bcrypt from "bcrypt";
import { UserData } from "../models/userData";

export async function checkIfUserExists(username: string): Promise<boolean> {
  const [result] = await sql.execute<RowDataPacket[]>(
    "SELECT id FROM users WHERE username = ?",
    [username]
  );

  if (result.length) {
    return true;
  }

  return false;
}

export async function registerUser(
  username: string,
  password: string,
  name: string,
  lastname: string
): Promise<number> {
  const hashedPassword = await hashPassword(password);

  const [result] = await sql.execute<ResultSetHeader>(
    "INSERT INTO users (username, password, name, lastname) VALUES (?, ?, ?, ?)",
    [username, hashedPassword, name, lastname]
  );

  return result.insertId;
}

export async function loginUser(
  username: string,
  password: string
): Promise<false | UserData> {
  const [[result]] = await sql.execute<RowDataPacket[]>(
    "SELECT id AS userId, username, password AS hash, name, lastname, userType FROM users WHERE username = ?",
    [username]
  );

  if (!(await checkPassword(password, result.hash))) {
    return false;
  }

  return {
    userId: result.userId,
    username: result.username,
    name: result.name,
    lastname: result.lastname,
    userType: result.userType
  };
}

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

async function checkPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
