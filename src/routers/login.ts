import express from "express";
import jwt from "jsonwebtoken";
import { loginUser } from "../queries/userQueries";
import { loginSchema } from "../schemas/login";
import { JWT_SECRET } from "../secret";

const router = express.Router();

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  const result = loginSchema.validate({ username, password });

  if (result.error) {
    const msg = result.error.message;

    res.send({ success: false, msg });

    return;
  }

  const userDetails = await loginUser(username, password);

  if (!userDetails) {
    res
      .status(401)
      .send({ success: false, msg: "Username and password don't match" });

    return;
  }

  const token = jwt.sign({ ...userDetails }, JWT_SECRET);

  res.send({ success: true, token });
});

export { router as login };
