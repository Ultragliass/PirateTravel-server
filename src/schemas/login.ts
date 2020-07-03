import joi from "@hapi/joi";

export const loginSchema = joi.object({
  username: joi.string().required(),
  password: joi.string().required(),
});
