import Joi from "joi";

export const addStockSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().min(1).required(),
  price: Joi.number().positive().required(),
  sellingPrice: Joi.number().positive().required(),
  status: Joi.string().valid('Available', 'Low', 'OutOfStock').required(),
  dateAdded: Joi.date().required(),
  cashier: Joi.string().required()
});

