import joi from "joi"; 
import { generalFeild } from "../../middlewares/validataion.middleware.js";


export const createPostSchema = joi.object( {

    content:joi.string().min(2).max(5000),
    file:joi.array().items(generalFeild.fileObject)

}).or("content","file")

export const updatePostSchema = joi.object( {

    postId:generalFeild.id.required(),
    content:joi.string().min(2).max(5000),
    file:joi.array().items(generalFeild.fileObject)

}).or("content","file")

export const softDeleteSchema = joi.object( {
    postId:generalFeild.id.required(),
})

export const restorePostSchema = joi.object( {
    postId:generalFeild.id.required(),
})

export const getSinglePostSchema = joi.object( {
    postId:generalFeild.id.required(),
})

export const like_unlikePostSchema = joi.object( {
    postId:generalFeild.id.required(),
})

export const likePostGraph = joi.object( {
    postId:generalFeild.id.required(),
    authorization:joi.string().required()
}).required()