import { JWTRequest } from "../models/jwtRequest";
import {
  getVacations,
  toggleVacationFollow,
  isAlreadyFollowing,
  isVacationExist,
  addVacation,
} from "../queries/vacationQueries";
import express from "express";
import { validateAdmin } from "../middleware/validateAdmin";
import { validateSchema } from "../middleware/validateSchema";
import { vacationSchema } from "../schemas/vacation";

const router = express.Router();

router.get("/", async (req: JWTRequest, res) => {
  const { userId } = req.user;

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

  if (!Number.isInteger(Number(vacationId))) {
    return res
      .status(400)
      .send({ success: false, msg: "The id must be an integer." });
  }

  const isExist = await isVacationExist(vacationId);

  if (!isExist) {
    return res
      .status(400)
      .send({ success: false, msg: "Vacation does not exist." });
  }

  const isFollowing = await isAlreadyFollowing(userId, vacationId);

  const affectedRows = await toggleVacationFollow(
    userId,
    vacationId,
    isFollowing
  );

  if (!affectedRows) {
    res.status(500).send({ success: false, msg: "Unexpected error." });

    return;
  }

  const msg = isFollowing ? "Vacation unfollowed." : "Vacation followed.";

  res.send({ success: true, msg });
});

router.post(
  "/",
  validateAdmin(),
  validateSchema(vacationSchema),
  async (req: JWTRequest, res) => {
    const {
      description,
      destination,
      image,
      startDate,
      endDate,
      price,
    } = req.body;

    const affectedRows = await addVacation(
      description,
      destination,
      image,
      startDate,
      endDate,
      price
    );

    if (!affectedRows) {
      return res.status(500).send({ success: false, msg: "Unexpected error." });
    }

    res.send({ success: true, msg: "Vacation added." });
  }
);

export { router as vacations };
