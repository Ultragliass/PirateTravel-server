import { loginUser } from "../queries/userQueries";
import { loginSchema } from "../schemas/login";
import { JWT_SECRET } from "../secret";
import express from "express";
import jwt from "jsonwebtoken";

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

  const tokenData = {
    userId: userDetails.userId,
    userType: userDetails.userType,
  };

  const userData = {
    username: userDetails.username,
    name: userDetails.name,
    lastname: userDetails.lastname,
  };

  const token = jwt.sign({ ...tokenData }, JWT_SECRET);

  res.send({ success: true, token, userData });
});

export { router as login };
