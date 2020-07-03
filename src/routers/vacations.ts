import express from "express";
import { JWTRequest } from "../models/jwtRequest";

const router = express.Router();

router.get("/", async (req: JWTRequest, res) => {
  const { userId } = req.user;

  if (!userId) {
    res.status(500).send({ success: false, msg: "Unexpected error." });

    return;
  }

  
});
