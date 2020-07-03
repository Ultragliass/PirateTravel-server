import { sql } from "../sql";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import bcrypt from "bcrypt";

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

export async function addUser(
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

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}
