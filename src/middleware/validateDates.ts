import { Request, Response, NextFunction } from "express";

export const validateDates = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { startDate, endDate } = req.body;

    if (new Date(startDate) < new Date() || new Date(endDate) < new Date()) {
      return res.status(401).send({
        success: false,
        msg: "Dates cannot be earlier than the current date",
      });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(401).send({
        success: false,
        msg: "Starting date must be earlier than end date",
      });
    }

    next();
  };
};
