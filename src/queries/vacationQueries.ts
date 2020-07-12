import { sql } from "../sql";
import { IVacation } from "../models/vacation";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export async function getVacations(
  userId: number | string
): Promise<RowDataPacket[]> {
  const [result] = await sql.execute<RowDataPacket[]>(
    `SELECT vacations.id, description, destination, image, startDate, endDate,
     price, followers, IF (userId = ?, true, false) AS isFollowing 
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
    await sql.execute<ResultSetHeader>(
      "UPDATE vacations SET followers = followers - 1 WHERE id = ?",
      [vacationId]
    );

    const [result] = await sql.execute<ResultSetHeader>(
      "DELETE FROM followers WHERE userId = ? AND vacationId = ?",
      [userId, vacationId]
    );

    return result.affectedRows;
  } else {
    await sql.execute<ResultSetHeader>(
      "UPDATE vacations SET followers = followers + 1 WHERE id = ?",
      [vacationId]
    );

    const [result] = await sql.execute<ResultSetHeader>(
      "INSERT INTO followers (userId, vacationId) VALUES (?, ?)",
      [userId, vacationId]
    );

    return result.affectedRows;
  }
}

export async function addVacation(body: IVacation): Promise<number> {
  const [result] = await sql.execute<ResultSetHeader>(
    `INSERT INTO vacations (description, destination, image, startDate, endDate, price)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      body.description,
      body.destination,
      body.image,
      body.startDate,
      body.endDate,
      body.price,
    ]
  );

  return result.insertId;
}

export async function updateVacation(
  body: IVacation,
  vacationId: number | string
): Promise<number> {
  const [result] = await sql.execute<ResultSetHeader>(
    `UPDATE vacations SET description = ?, destination = ?, image = ?, startDate = ?, endDate = ?, price = ? WHERE id = ?`,
    [
      body.description,
      body.destination,
      body.image,
      body.startDate,
      body.endDate,
      body.price,
      vacationId,
    ]
  );

  return result.affectedRows;
}

export async function deleteVacation(
  vacationId: string | number
): Promise<number> {
  await sql.execute<ResultSetHeader>(
    "DELETE FROM followers WHERE vacationId = ?",
    [vacationId]
  );

  const [result] = await sql.execute<ResultSetHeader>(
    "DELETE FROM vacations WHERE id = ?",
    [vacationId]
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
