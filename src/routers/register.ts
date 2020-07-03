import { checkIfUserExists, addUser } from "../queries/userQueries";
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

  const userId = await addUser(username, password, name, lastname);

  const token = jwt.sign({ username, userId, name, lastname }, JWT_SECRET);

  res.send({ success: true, token, userId });
});

export { router as register };
