import joi from "@hapi/joi";

export const registerSchema = joi.object({
  username: joi.string().alphanum().min(4).max(20).required(),

  password: joi
    .string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,30}$/)
    .required(),

  name: joi
    .string()
    .pattern(/^[A-Za-z]{1,20}$/)
    .required(),

  lastname: joi
    .string()
    .pattern(/^[A-Za-z]{1,20}$/)
    .required(),
});
