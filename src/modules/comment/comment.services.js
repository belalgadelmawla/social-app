import { nanoid } from "nanoid";
import * as DBservices from "../../DB/DBServices.js"
import cloudinary from "../../utils/file uploading/cloudinaryConfig.js";
import { postModel } from "../../DB/models/post.model.js";
import { commentModel } from "../../DB/models/commnet.model.js";
import { roleTypes } from "../../DB/models/user.model.js";

export const createComment = async (req,res,next) => {

    const {postId} =req.params;
    const {text} =req.body;

    

    const post = await DBservices.findById( {
        model:postModel,
        id:postId
    })

    if(!post) return next(new Error("post not found" ,{cause: 404}))

    let myImage;

    if(req.file) {
        const {secure_url, public_id} =await  cloudinary.uploader.upload(
            req.file.path,
            {folder:`posts/${post.createdBy}/post/${post.customId}/comments`}
        
        );
        myImage = {secure_url, public_id}
    }

    const comment = await DBservices.create({
        model:commentModel,
        data:{
            text,
            createdBy:req.user._id,
            postId:post._id,
            image:myImage
        }

    })
    

    return res.status(201).json({success:true, data: {comment}})
}

export const updateComment = async (req,res,next) => {

    const {commentId} =req.params;
    const {text} =req.body;

    

    const comment = await DBservices.findById( {
        model:commentModel,
        id:commentId
    })

    if(!comment) return next(new Error("comment not found" ,{cause: 404}))


    const post = await DBservices.findOne( {
        model:postModel,
        filter:{_id:comment.postId, isDeleted:false}
    })

    if(!post) return next(new Error("post not found" ,{cause: 404}))


        if(comment.createdBy.toString() !== req.user._id.toString())
            return next(new Error("unauthorized",{cause:401}))

        let image;

        if(req.file) {
            const {secure_url, public_id} =await cloudinary.uploader.upload(
                req.file.path,
                {folder:`posts/${post.createdBy}/post/${post.customId}/comments`}
            
            );
            image = {secure_url, public_id}

            if(comment.image){
                await cloudinary.uploader.destroy(comment.image.public_id)
            }

            comment.image = image
        }

        comment.text = text ? text : comment.text;

        await comment.save()

    

    return res.status(201).json({success:true, data: {comment}})
}

export const softDeleteComment = async (req,res,next) => {

    const {commentId} =req.params;

    

    const comment = await DBservices.findById( {
        model:commentModel,
        id:commentId
    })

    if(!comment) return next(new Error("comment not found" ,{cause: 404}))


    const post = await DBservices.findOne( {
        model:postModel,
        filter:{_id:comment.postId, isDeleted:false}
    })

    if(!post) return next(new Error("post not found" ,{cause: 404}))

    const commentOwner = comment.createdBy.toString() === req.user._id.toString();

    const postOwner = post.createdBy.toString() === req.user._id.toString();

    const admin = req.user.role === roleTypes.admin;

    if(!(commentOwner || postOwner || admin))
        return next(new Error("unauthorized",{cause:401}))

    comment.isDeleted =true;

    comment.deletedBy = req.user._id;

    await comment.save();

    

    return res.status(201).json({success:true, data: {comment}})
}

export const getAllComment = async (req,res,next) => {

    const {postId} =req.params;


    const post = await DBservices.findOne( {
        model:postModel,
        filter:{_id:postId, isDeleted:false}
    })

    if(!post) return next(new Error("post not found" ,{cause: 404}))

    const comment =await DBservices.find({
        model:commentModel,
        filter:{postId, isDeleted:false,parentComment:{ $exists:false }},
        populate:[{path:"replies"}]
    })
    

    return res.status(201).json({success:true, data: {comment}})
}

export const likeAndUnlike = async (req,res,next) => {

    const{commentId} =req.params;
    const userId = req.user._id;
    
    const comment = await DBservices.findOne({
        model:commentModel,
        filter:{_id:commentId,isDeleted:false}
    })

    if(!comment) return next(new Error("comment not found",{cause: 404}))

        const isUserLike = comment.likes.find(
            (user)=> user.toString() === userId.toString()
        )

        if (!isUserLike) {
            comment.likes.push(userId)
        }
        else{
            comment.likes =comment.likes.filter((user) => user.toString() !== userId.toString())
        }

        await comment.save();

        const populatedusers = await DBservices.findOne({
            model:commentModel,
            filter:{_id:commentId,isDeleted:false},
        })
        populate:[{path:"likes",select:"userName images -_id"}]

        return res.status(200).json({success:true, data:{ populatedusers }})
}

export const addReply = async (req,res,next) => {

    const{postId,commentId} =req.params;

    const comment = await DBservices.findOne({
        model:commentModel,
        filter:{_id:commentId,isDeleted:false}
    })

    
    if(!comment) return next(new Error("comment not found",{cause: 404}))

    const post = await DBservices.findOne({
        model:postModel,
        filter:{_id:postId,isDeleted:false}
    })

    if(!post) return next(new Error("post not found",{cause: 404}))

        let myImage;

        if(req.file) {
            const {secure_url, public_id} =await  cloudinary.uploader.upload(
                req.file.path,
                {folder:`posts/${post.createdBy}/post/${post.customId}/comments/${comment._id}`}
            
            );
            myImage = {secure_url, public_id}
        }
    
        const reply = await DBservices.create({
            model:commentModel,
            data:{
                ...req.body,
                createdBy:req.user._id,
                postId,
                image:myImage,
                parentComment:comment._id
            }
    
        })

        return res.status(201).json({success:true, data:{ reply }})
}

export const deleteComment = async (req,res,next) => {

    const {commentId} =req.params;

    

    const comment = await DBservices.findById( {
        model:commentModel,
        id:commentId
    })

    if(!comment) return next(new Error("comment not found" ,{cause: 404}))


    const post = await DBservices.findOne( {
        model:postModel,
        filter:{_id:comment.postId, isDeleted:false}
    })

    if(!post) return next(new Error("post not found" ,{cause: 404}))

    const commentOwner = comment.createdBy.toString() === req.user._id.toString();

    const postOwner = post.createdBy.toString() === req.user._id.toString();

    const admin = req.user.role === roleTypes.admin;

    if(!(commentOwner || postOwner || admin))
        return next(new Error("unauthorized",{cause:401}))

    await comment.deleteOne();

    return res.status(201).json({success:true,message:"comment deleted successfully"})
}
