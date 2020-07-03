import { checkIfUserExists, registerUser } from "../queries/userQueries";
import { registerSchema } from "../schemas/register";
import { JWT_SECRET } from "../secret";
import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/", async (req, res) => {
  const { username, password, name, lastname } = req.body;

  const result = registerSchema.validate({
    username,
    password,
    name,
    lastname,
  });

  if (result.error) {
    const msg: string = result.error.message;

    res.status(400).send({ success: false, msg });

    return;
  }

  if (await checkIfUserExists(username)) {
    res.status(409).send({ success: false, msg: "User already exists." });

    return;
  }

  const userId = await registerUser(username, password, name, lastname);

  const token = jwt.sign({ userId, userType: "user" }, JWT_SECRET);

  res.send({ success: true, token, userData: { username, name, lastname } });
});

export { router as register };
