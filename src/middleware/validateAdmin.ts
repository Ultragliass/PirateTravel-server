import { JWTRequest } from "../models/jwtRequest";
import { Response, NextFunction } from "express";

export const validateAdmin = () => {
  return (req: JWTRequest, res: Response, next: NextFunction) => {
    if (req.user.userType !== "admin") {
      return res.status(403).send({
        success: false,
        msg: "You do not have permission to perform this action.",
      });
    }

    next();
  };
};
