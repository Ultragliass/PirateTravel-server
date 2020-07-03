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
  id: number | string,
  isFollowing: boolean
) {
  if (isFollowing) {
    const [result] = await sql.execute<ResultSetHeader>(
      `DELETE FROM followers WHERE userId = ? AND vacationId = ?;
      UPDATE vacations SET followers = followers - 1 WHERE id`,
      [userId, id]
    );
    
  }
}
