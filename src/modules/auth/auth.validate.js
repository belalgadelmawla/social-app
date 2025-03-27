import joi from "joi";
import { generalFeild } from "../../middlewares/validataion.middleware.js";

export const registerSchema = joi.object({ 
    userName:generalFeild.userName.required(),
    email:generalFeild.email.required(),
    password:generalFeild.password.required(),
    confirmPassword:generalFeild.confirmPassword.required(),
    phone:generalFeild.phone.required(),
    role:generalFeild.role.required(),

}).required()

export const loginSchema = joi.object({

    email:generalFeild.email.required(),
    password:generalFeild.password.required(),
    
}).required()

export const confirmEmailSchema = joi.object({

    email:generalFeild.email.required(),
    code:generalFeild.code.required()
}).required()

export const forgetPasswordschema = joi.object({

    email:generalFeild.email.required()
}).required()

export const resetPasswordschema = joi.object({
    email:generalFeild.email.required(),
    code:generalFeild.code.required(),
    password:generalFeild.password.required(),
    confirmPassword:generalFeild.confirmPassword.required()
}).required()

