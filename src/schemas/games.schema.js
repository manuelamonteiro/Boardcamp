import joi from "joi";

export const gamesSchema = joi.object({
    name: joi.string().min(1).required().trim(),
    image: joi.string().uri().required(),
    stockTotal: joi.number().greater(0).required(),
    pricePerDay: joi.number().greater(0).required(),
    categoryId: joi.required()
});