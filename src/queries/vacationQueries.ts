import { sql } from "../sql";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export async function getVacations(
  userId: number | string
): Promise<RowDataPacket[]> {
  const [result] = await sql.execute<RowDataPacket[]>(
    `SELECT description, destination, image, startDate, endDate, price, 
    IF (followers.userId > 0, true, false) AS isFollowing 
    FROM vacations LEFT JOIN followers ON vacations.id = followers.vacationId`,
    [userId]
  );

  return result;
}

export async function toggleVacationFollow(
  userId: number | string,
  vacationId: number | string,
  isFollowing: boolean
): Promise<number> {
  if (isFollowing) {
    const [result] = await sql.execute<ResultSetHeader>(
      "DELETE FROM followers WHERE userId = ? AND vacationId = ?",
      [userId, vacationId]
    );

    return result.affectedRows;
  } else {
    const [result] = await sql.execute<ResultSetHeader>(
      "INSERT INTO followers (userId, vacationId) VALUES (?, ?)",
      [userId, vacationId]
    );

    return result.affectedRows;
  }
}

export async function addVacation(
  description: string,
  destination: string,
  image: string,
  startDate: Date,
  endDate: Date,
  price: number | string
): Promise<number> {
  const [result] = await sql.execute<ResultSetHeader>(
    `INSERT INTO vacations (description, destination, image, startDate, endDate, price)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [description, destination, image, startDate, endDate, price]
  );

  return result.affectedRows;
}

export async function isAlreadyFollowing(
  userId: number | string,
  vacationId: number | string
): Promise<boolean> {
  const [result] = await sql.execute<RowDataPacket[]>(
    "SELECT id FROM followers WHERE userId = ? AND vacationId = ?",
    [userId, vacationId]
  );

  return result.length > 0;
}

export async function isVacationExist(
  vacationId: number | string
): Promise<boolean> {
  const [result] = await sql.execute<RowDataPacket[]>(
    "SELECT id FROM vacations WHERE id = ?",
    [vacationId]
  );

  return result.length > 0;
}
