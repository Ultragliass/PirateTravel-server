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
  const { userId, userType } = req.user;

  if (userType !== "user") {
    res.status(403).send({
      success: false,
      msg: "You do not have permission to perform this action.",
    });

    return;
  }

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

router.post("/", (req: JWTRequest, res) => {
  const { userType } = req.user;

  const {} = req.body;

  if (userType !== "admin") {
    res.status(403).send({
      success: false,
      msg: "You do not have permission to perform this action.",
    });

    return;
  }

  
});

export { router as vacations };
