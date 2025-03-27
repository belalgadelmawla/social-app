import joi from "joi"; 
import { generalFeild } from "../../middlewares/validataion.middleware.js";

export const shareProfileShema = joi.object({
    profileId: generalFeild.id.required()
}).required()

export const updateEmailSchema = joi.object({
    email: generalFeild.email.required()
}).required()

export const resetEmailSchema = joi.object({
    oldCode: generalFeild.code.required(),
    newCode: generalFeild.code.required()
}).required()

export const updatePasswordSchema = joi.object({
    oldPassword: generalFeild.password.required(),
    password: generalFeild.password.not(joi.ref("oldPassword")).required(),
    confirmPassword:generalFeild.confirmPassword.required()
}).required()

export const updateProfileSchema = joi.object({
    userName: generalFeild.userName,
    address: generalFeild.address,
    gender:generalFeild.gender,
    phone:generalFeild.phone,
    DOB:generalFeild.DOB
}).required()

