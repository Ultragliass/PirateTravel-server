import { JWTRequest } from "../models/jwtRequest";
import { isVacationExist } from "../queries/vacationQueries";
import { Response, NextFunction } from "express";
import { Packet } from "socket.io";

export const validateVacationExist = () => {
  return async function (req: JWTRequest, res: Response, next: NextFunction) {
    const { vacationId } = req.params;

    if (!Number.isInteger(Number(vacationId))) {
      return res
        .status(400)
        .send({ success: false, msg: "Parameter must be an integer." });
    }

    const isExist = await isVacationExist(vacationId);

    if (!isExist) {
      return res
        .status(400)
        .send({ success: false, msg: "Vacation does not exist." });
    }

    next();
  };
};

export const validateVacationExistSocket = () => {
  return async function ([_, { vacationId }]: Packet, next: NextFunction) {
    if (!Number.isInteger(Number(vacationId))) {
      return next(new Error("vacationId must be a number."));
    }

    const isExist = await isVacationExist(vacationId);

    if (!isExist) {
      return next(new Error("Vacation does not exist."));
    }

    return next();
  };
};
