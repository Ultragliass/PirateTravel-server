import { JWTRequest } from "../models/jwtRequest";
import {
  getVacations,
  toggleVacationFollow,
  isAlreadyFollowing,
  addVacation,
  updateVacation,
  deleteVacation,
  addComment,
  getComments,
} from "../queries/vacationQueries";
import { validateAdmin } from "../middleware/validateAdmin";
import { validateSchema } from "../middleware/validateSchema";
import { validateVacationExist } from "../middleware/validateVacationExist";
import { validateDates } from "../middleware/validateDates";
import { vacationSchema } from "../schemas/vacation";
import { commentSchema } from "../schemas/comment";
import { io } from "../wss/websocketserver";
import express, { response } from "express";

const router = express.Router();

router.get("/", async (req: JWTRequest, res) => {
  const { userId } = req.user;

  const vacations = await getVacations(userId);

  res.send({ success: true, vacations });
});

router.post(
  "/",
  validateAdmin(),
  validateSchema(vacationSchema),
  validateDates(),
  async (req: JWTRequest, res) => {
    const insertedId = await addVacation(req.body);

    if (!insertedId) {
      return res.status(500).send({ success: false, msg: "Unexpected error." });
    }

    res.send({ success: true, msg: "VACATION ADDED.", id: insertedId });

    const vacation = { ...req.body, id: insertedId };

    io().in("users").emit("add_vacation", { vacation });
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

    const msg = isFollowing ? "VACATION UNFOLLOWED." : "VACATION FOLLOWED.";

    res.send({ success: true, msg });

    io().in("admins").emit("toggle_follow", { id: vacationId, isFollowing });
  }
);

router.put(
  "/:vacationId/edit",
  validateAdmin(),
  validateVacationExist(),
  validateSchema(vacationSchema),
  validateDates(),
  async (req: JWTRequest, res) => {
    const { vacationId } = req.params;

    const affectedRows = await updateVacation(req.body, vacationId);

    if (!affectedRows) {
      return res.status(500).send({ success: false, msg: "Unexpected error." });
    }

    res.send({ success: true, msg: "VACATION UPDATED." });

    const vacation = { ...req.body, id: Number(vacationId) };

    io().in("users").emit("update_vacation", { vacation });
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

    res.send({ success: true, msg: "VACATION DELETED." });

    io().in("users").emit("delete_vacation", { id: vacationId });
  }
);

router.get(
  "/:vacationId/comments",
  validateVacationExist(),
  async (req: JWTRequest, res) => {
    const { vacationId } = req.params;

    const comments = await getComments(vacationId);

    res.send({ success: true, comments });
  }
);

router.post(
  "/:vacationId/comments",
  validateVacationExist(),
  validateSchema(commentSchema),
  async (req: JWTRequest, res) => {
    const { vacationId } = req.params;

    const { userId, userType } = req.user;

    if (userType !== "user") {
      return res.status(401).send({
        success: false,
        msg: "You do not have permission to perform this action.",
      });
    }

    const { comment } = req.body;

    const username = await addComment(userId, vacationId, comment);

    if (!username) {
      return res.status(500).send({ success: false, msg: "Unexpected error." });
    }

    res.send({ success: true, msg: "COMMENT ADDED." });

    io().emit("add_comment", {
      id: vacationId,
      comment: { username, comment },
    });
  }
);

export { router as vacations };
