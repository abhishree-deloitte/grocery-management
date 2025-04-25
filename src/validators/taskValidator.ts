import Joi from "joi";

export const taskSchema = Joi.object({
  taskType: Joi.string().valid("Order-Related", "Stock-Related").required(),
  assignee: Joi.string().required(),
  priorityLevel: Joi.string().valid("Low", "Medium", "High", "Critical").required(),
  description: Joi.string().required(),
  dueDate: Joi.date().required(),
  location: Joi.string().required()
});
