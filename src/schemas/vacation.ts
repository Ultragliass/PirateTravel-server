import joi from "@hapi/joi";

export const vacationSchema = joi.object({
  description: joi.string().empty().min(30).max(200).required(),
  destination: joi.string().empty().max(30).required(),
  image: joi.string().empty().max(100).required(),
  startDate: joi.date().required(),
  endDate: joi.date().required(),
  price: joi.number().required(),
});
