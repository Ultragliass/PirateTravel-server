import { Response, NextFunction } from "express";
import { JWTRequest } from "../models/jwtRequest";
import { isVacationExist } from "../queries/vacationQueries";

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
