import joi from "joi";
import { generalFeild } from "../../middlewares/validataion.middleware.js";
import { isValidObjectId } from "mongoose";
import { roleTypes } from "../../DB/models/user.model.js";

export const changeRoleSchema = joi.object({ 
    userId:joi.custom(isValidObjectId).required(),
    role:joi.string().valid(...Object.values(roleTypes)).required()


}).required()


