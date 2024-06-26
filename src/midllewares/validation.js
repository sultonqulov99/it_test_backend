import { registerSchema,contactSchema } from "../utils/validations.js";
import { ValidationError } from "../utils/errors.js";

export default (req,res,next)=> {
    try {
        if(req.url == '/api/register'){
            const {error} = registerSchema.validate(req.body)
            if(error) throw error
        }
        if(req.url == '/api/contact'){
            const {error} = contactSchema.validate(req.body)
            if(error) throw error
        }
        return next()
    } catch (error) {
        return next(new ValidationError(400,error.details[0].message))
    }   
}