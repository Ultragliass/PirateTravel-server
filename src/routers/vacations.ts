import express from "express";
import { JWTRequest } from "../models/jwtRequest";
import { getVacations } from "../queries/vacationQueries";

const router = express.Router();

router.get("/", async (req: JWTRequest, res) => {
  const { userId } = req.user;

  if (!userId) {
    res.status(500).send({ success: false, msg: "Unexpected error." });

    return;
  }

  const vacations = await getVacations(userId);

  res.send(vacations);
});

router.put("/toggle_follow/:id", (req: JWTRequest, res) => {
    const { id } = req.params;
    const { userId } = req.user;
    const { isFollowing } = req.body;

    
});

export { router as vacations };
