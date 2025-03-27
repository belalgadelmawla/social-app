import joi from "joi"; 
import { generalFeild } from "../../middlewares/validataion.middleware.js";


export const createCommentSchema = joi.object( {

    text:joi.string().min(2).max(5000),
    file:generalFeild.fileObject,
    postId:generalFeild.id.required()

}).or("text","file")

export const updateCommentSchema = joi.object( {

    text:joi.string().min(2).max(5000),
    file:generalFeild.fileObject,
    commentId:generalFeild.id.required()

}).or("text","file")

export const softDeleteCommentSchema = joi.object( {

    commentId:generalFeild.id.required()

})

export const getAllCommentSchema = joi.object( {

    postId:generalFeild.id.required()

})

export const like_unlikecommentSchema = joi.object( {
    commentId:generalFeild.id.required()
})

export const addReplySchema = joi.object( {

    text:joi.string().min(2).max(5000),
    file:generalFeild.fileObject,
    commentId:generalFeild.id.required(),
    postId:generalFeild.id.required()

}).or("text","file")

export const deleteCommentSchema = joi.object( {
    commentId:generalFeild.id.required(),
})