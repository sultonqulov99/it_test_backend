import Joi from 'joi'
export const registerSchema = Joi.object({
    name: Joi.string().min(3).max(50).alphanum().required(),
    surname: Joi.string().min(3).max(50).alphanum().required(),
    region: Joi.string().alphanum().required(),
    status_id: Joi.string().required(),
    contact: Joi.string().pattern(/^\+998(90|91|93|94|95|97|98|99|33|88)[0-9]{7}$/).required(),
    description:Joi.string().min(2).max(255),
    password: Joi.string().min(3).max(15).required(),
})
export const contactSchema = Joi.object({
    fullName: Joi.string().min(3).max(50).alphanum().required(),
    contact: Joi.string().pattern(/^\+998(90|91|93|94|95|97|98|99|33|88)[0-9]{7}$/).required(),
    text:Joi.string().min(2).max(500).required(),
    user_id:Joi.string().required()
})
