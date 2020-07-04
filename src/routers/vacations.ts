import { JWTRequest } from "../models/jwtRequest";
import {
  getVacations,
  toggleVacationFollow,
  isAlreadyFollowing,
  addVacation,
  updateVacation,
} from "../queries/vacationQueries";
import { validateAdmin } from "../middleware/validateAdmin";
import { validateSchema } from "../middleware/validateSchema";
import { vacationSchema } from "../schemas/vacation";
import { validateVacationExist } from "../middleware/validateVacationExist";
import express from "express";

const router = express.Router();

router.get("/", async (req: JWTRequest, res) => {
  const { userId } = req.user;

  const vacations = await getVacations(userId);

  res.send(vacations);
});

router.post(
  "/",
  validateAdmin(),
  validateSchema(vacationSchema),
  async (req: JWTRequest, res) => {
    const affectedRows = await addVacation(req.body);

    if (!affectedRows) {
      return res.status(500).send({ success: false, msg: "Unexpected error." });
    }

    res.send({ success: true, msg: "Vacation added." });
  }
);

router.put(
  "/toggle_follow/:vacationId",
  validateVacationExist(),
  async (req: JWTRequest, res) => {
    const { vacationId } = req.params;
    const { userId, userType } = req.user;

    if (userType !== "user") {
      return res.status(403).send({
        success: false,
        msg: "You do not have permission to perform this action.",
      });
    }

    const isFollowing = await isAlreadyFollowing(userId, vacationId);

    const affectedRows = await toggleVacationFollow(
      userId,
      vacationId,
      isFollowing
    );

    if (!affectedRows) {
      return res.status(500).send({ success: false, msg: "Unexpected error." });
    }

    const msg = isFollowing ? "Vacation unfollowed." : "Vacation followed.";

    res.send({ success: true, msg });
  }
);

router.put(
  "/edit_vacation/:vacationId",
  validateAdmin(),
  validateVacationExist(),
  validateSchema(vacationSchema),
  async (req: JWTRequest, res) => {
    const { vacationId } = req.params;

    const affectedRows = await updateVacation(req.body, vacationId);

    if (!affectedRows) {
      return res.status(500).send({ success: false, msg: "Unexpected error." });
    }

    res.send({ success: true, msg: "Vacation updated." });
  }
);

export { router as vacations };
