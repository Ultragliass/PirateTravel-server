import { JWTRequest } from "../models/jwtRequest";
import {
  getVacations,
  toggleVacationFollow,
  isAlreadyFollowing,
  addVacation,
  updateVacation,
  deleteVacation,
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
    const insertedId = await addVacation(req.body);

    if (!insertedId) {
      return res.status(500).send({ success: false, msg: "Unexpected error." });
    }

    res.send({ success: true, msg: "Vacation added.", insertedId });
  }
);

router.put(
  "/:vacationId/toggle_follow",
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

    res.send({ success: true, msg, vacationId });
  }
);

router.put(
  "/:vacationId/edit",
  validateAdmin(),
  validateVacationExist(),
  validateSchema(vacationSchema),
  async (req: JWTRequest, res) => {
    const { vacationId } = req.params;

    const affectedRows = await updateVacation(req.body, vacationId);

    if (!affectedRows) {
      return res.status(500).send({ success: false, msg: "Unexpected error." });
    }

    res.send({ success: true, msg: "Vacation updated.", vacationId });
  }
);

router.delete(
  "/:vacationId",
  validateAdmin(),
  validateVacationExist(),
  async (req, res) => {
    const { vacationId } = req.params;

    const affectedRows = await deleteVacation(vacationId);

    if (!affectedRows) {
      return res.status(500).send({ success: false, msg: "Unexpected error." });
    }

    res.send({ success: true, msg: "Vacation deleted.", vacationId });
  }
);

export { router as vacations };
