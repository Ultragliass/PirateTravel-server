import {
  checkIfUserExists,
  registerUser,
  authenticateUser,
} from "../queries/userQueries";
import { registerSchema } from "../schemas/register";
import { loginUser } from "../queries/userQueries";
import { loginSchema } from "../schemas/login";
import { JWT_SECRET } from "../secret";
import { JWTRequest } from "../models/jwtRequest";
import { validateSchema } from "../middleware/validateSchema";
import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", validateSchema(registerSchema), async (req, res) => {
  const { username, password, name, lastname } = req.body;

  if (await checkIfUserExists(username)) {
    return res.status(409).send({ success: false, msg: "User already exists" });
  }

  const userId = await registerUser(username, password, name, lastname);

  const token = jwt.sign({ userId, userType: "user" }, JWT_SECRET);

  res.send({ success: true, token, userData: { username, name, lastname } });
});

router.post("/login", validateSchema(loginSchema), async (req, res) => {
  const { username, password } = req.body;

  const userDetails = await loginUser(username, password);

  if (!userDetails) {
    return res
      .status(401)
      .send({ success: false, msg: "Username and password don't match" });
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

  res.send({ success: true, token, userData, userType: userDetails.userType });
});

router.get("/authenticate", async (req: JWTRequest, res) => {
  const { userId } = req.user;

  const userDetails = await authenticateUser(userId);

  if (!userDetails.userData) {
    return res.status(500).send({ success: false, msg: "Unexpected error" });
  }

  const {userData, userType} = userDetails;

  res.send({ success: true, userData, userType });
});

export { router as users };
