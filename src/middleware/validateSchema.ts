import joi from "@hapi/joi";
import { Request, Response, NextFunction } from "express";
import { Packet } from "socket.io";

export const validateSchema = (schema: joi.Schema) => {
  return function (req: Request, res: Response, next: NextFunction) {
    const result = schema.validate({ ...req.body });

    if (result.error) {
      const msg = result.error.message;

      return res.status(400).send({ success: false, msg });
    }

    next();
  };
};

export const validateSchemaSocket = (schema: joi.Schema) => {
  return function ([_, { vacation }]: Packet, next: NextFunction) {
    const result = schema.validate({ ...vacation });

    if (result.error) {
      const msg = result.error.message;

      return next(new Error(msg));
    }

    next();
  };
};
