import { checkIfUserExists, registerUser } from "../queries/userQueries";
import { registerSchema } from "../schemas/register";
import { JWT_SECRET } from "../secret";
import { validateSchema } from "../middleware/validateSchema";
import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/", validateSchema(registerSchema), async (req, res) => {
  const { username, password, name, lastname } = req.body;

  if (await checkIfUserExists(username)) {
    return res
      .status(409)
      .send({ success: false, msg: "User already exists." });
  }

  const userId = await registerUser(username, password, name, lastname);

  const token = jwt.sign({ userId, userType: "user" }, JWT_SECRET);

  res.send({ success: true, token, userData: { username, name, lastname } });
});

export { router as register };
