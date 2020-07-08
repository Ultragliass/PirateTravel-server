import joi from "@hapi/joi";

export const loginSchema = joi.object({
  username: joi.string().empty().required(),
  password: joi.string().empty().required(),
});
