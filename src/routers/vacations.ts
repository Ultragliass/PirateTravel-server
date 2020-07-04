import { JWTRequest } from "../models/jwtRequest";
import {
  getVacations,
  toggleVacationFollow,
  isAlreadyFollowing,
  isVacationExist,
} from "../queries/vacationQueries";
import { followToggleSchema } from "../schemas/followToggle";
import express from "express";

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

router.put("/toggle_follow/:vacationId", async (req: JWTRequest, res) => {
  const { vacationId } = req.params;
  const { userId } = req.user;

  const resolve = followToggleSchema.validate({
    vacationId,
    userId,
  });

  if (resolve.error) {
    const msg = resolve.error.message;

    res.status(400).send({ success: false, msg });

    return;
  }

  const isExist = isVacationExist(vacationId);

  if (!isExist) {
    res.status(400).send({ success: false, msg: "Vacatino does not exist." });

    return;
  }

  const isFollowing = await isAlreadyFollowing(userId, vacationId);

  await toggleVacationFollow(userId, vacationId, isFollowing);

  const msg = isFollowing ? "Vacation unfollowed." : "Vacation followed";

  res.send({ success: true, msg });
});

export { router as vacations };
