import joi from "@hapi/joi";

export const commentSchema = joi.object({
  comment: joi.string().empty().max(100).required(),
});
