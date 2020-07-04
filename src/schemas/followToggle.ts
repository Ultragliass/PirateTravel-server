import joi from "@hapi/joi";

export const followToggleSchema = joi.object({
  vacationId: joi.string().required(),
  userId: joi.number().required(),
});
