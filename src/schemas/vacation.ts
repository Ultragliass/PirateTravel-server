import joi from "@hapi/joi";

export const vacationSchema = joi.object({
  description: joi.string().empty().min(30).max(200).required(),
  destination: joi.string().empty().max(30).required(),
  image: joi.string().empty().max(200).pattern(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|png|JPG|jpeg|JPEG)/).required(),
  startDate: joi.date().required(),
  endDate: joi.date().required(),
  price: joi.number().positive().required(),
  isFollowing: 0,
  followers: joi.number(),
});
