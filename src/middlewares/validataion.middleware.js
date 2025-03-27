import { Types } from "mongoose";
import joi from "joi";
import { roleTypes } from "../DB/models/user.model.js";
import { genderTypes } from "../DB/models/user.model.js";




export const validation = (schema) => {
    
    return (req,res,next) => {

        const data = { ...req.body , ...req.params , ...req.query}

        if (req.file || req.files?.length) {
        
            if (Array.isArray(req.files)) {
                req.files = req.files.map(file => {
                    const { encoding, ...filteredFile } = file; 
                    return filteredFile;
                });
            }
        
            data.file = req.file || req.files;
        }
        
        const results = schema.validate(data,{abortEarly:false})

        if(results.error) {
            const errorMessage = results.error.details.map((obj)=> obj.message);
            return next(new Error(errorMessage,{cause:400}))
        }

        return next();
    }
}

export const isValidateObjectId = (value,helper)=> {
    if(Types.ObjectId.isValid(value)) return true
    
    return helper.message("receiver must be valid object id")
    }
    
    export const generalFeild = {
            userName:joi.string().min(3).max(20),
            email:joi.string().email({minDomainSegments:2,maxDomainSegments:2,tlds:{allow:["com","net"]}}),
            password:joi.string(),
            confirmPassword:joi.string().valid(joi.ref("password")),
            phone:joi.string().pattern(new RegExp(/^(\+20|0)?1[0-2,5]{1}[0-9]{8}$/)),
            role:joi.string().valid(...Object.values(roleTypes)),
            gender:joi.string().valid(...Object.values(genderTypes)),
            code:joi.string().pattern(new RegExp(/^[0-9]{5}$/)),
            id:joi.string().custom(isValidateObjectId),
            DOB:joi.date().less("now"),
            address:joi.string(),
            fileObject: joi.object({
                fieldname: joi.string().required(),
                originalname: joi.string().required(),
                mimetype: joi.string().required(),
                size: joi.number().required(),
                destination: joi.string().required(),
                filename: joi.string().required(),
                path: joi.string().required(),
            }).unknown(true)
    }
