import { JWTRequest } from "../models/jwtRequest";
import { Response, NextFunction } from "express";
import { Packet } from "socket.io";

export const validateAdmin = () => {
  return function (req: JWTRequest, res: Response, next: NextFunction) {
    if (req.user.userType !== "admin") {
      return res.status(403).send({
        success: false,
        msg: "You do not have permission to perform this action.",
      });
    }

    next();
  };
};