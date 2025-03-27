import { nanoid } from "nanoid";
import * as DBservices from "../../DB/DBServices.js"
import cloudinary from "../../utils/file uploading/cloudinaryConfig.js";
import { postModel } from "../../DB/models/post.model.js";
import { roleTypes } from "../../DB/models/user.model.js";
import { commentModel } from "../../DB/models/commnet.model.js";
import { populate } from "dotenv";


export const createPost = async (req,res,next) => {

    const {content} = req.body;

    const allImages = [];

    let customId;

    if(req.files.length) {
        for (const file of req.files) {
            customId =nanoid(5);
            const {secure_url,public_id} = await cloudinary.uploader.upload(file.path,
                {folder:`posts/${req.user._id}/post/${customId}`}
            );

            allImages.push({secure_url,public_id})
        }}

    const post = await DBservices.create({
        model:postModel,
        data:{
            content,
            images:allImages,
            createdBy:req.user._id,
            customId
        }

    })


    return res.status(200).json({success:true, data:{ post }})
}

export const updatePost = async (req,res,next) => {

    const {content} = req.body;
    const {postId} = req.params;

    const post = await DBservices.findOne({
        model:postModel,
        filter:{_id:postId , createdBy:req.user._id}
    })

    if(!post) return next(new Error("post not found", { cause:404 }))

    const allImages = [];

    if(req.files.length) {
        for (const file of req.files) {
            for (const file of post.images) {
                await cloudinary.uploader.destroy(file.public_id)
            }

            const {secure_url,public_id} = await cloudinary.uploader.upload(file.path,
                {folder:`posts/${req.user._id}/post/${post.customId}`}
            );

            allImages.push({ secure_url , public_id })
        }

        post.images = allImages;
    }

    post.content = content ? content : post.content;

    await post.save();


    return res.status(200).json({success:true, data:{ post }})
}

export const softDelete = async (req,res,next) => {


    const {postId} = req.params;

    const post = await DBservices.findById({
        model:postModel,
        id:{_id:postId }
    })

    if(!post) return next(new Error("post not found",{cause: 404}))

    if(post.createdBy.toString() === req.user._id.toString() || req.user.role === roleTypes.admin) {
        post.isDeleted = true;
        post.deletedBy = req.user._id;

        await post.save()

        return res.status(200).json({success:true, data:{ post }})
    }else {
        return next(new Error("unauthorized" ,{cause:401}))
    }

}

export const restorePost = async (req, res, next) => {
    const { postId } = req.params;

    let filter = { _id: postId, isDeleted: true };

    
    if (req.user.role !== roleTypes.admin) {
        filter.deletedBy = req.user._id;
    }

    const post = await DBservices.findOneAndUpdate({
        model: postModel,
        filter,
        data: {
            isDeleted: false,
            $unset: { deletedBy: "" },
        },
        options: { new: true },
    });

    if (!post) return next(new Error("Post not found or already restored", { cause: 404 }));

    return res.status(200).json({ success: true, data: { post } });
};


export const getSinglePost = async (req,res,next) => {


    const {postId} = req.params;

    const post = await DBservices.findOne({
        model:postModel,
        filter:{_id:postId, isDeleted:false },
        populate:[
            {path:"createdBy",select:"userName images -_id"},
        {
            path:"comments",
            select:"text image -_id",
            match:{parentComment:{ $exists:false }},
    populate:[{path:"createdBy",select:"userName image -_id"},{path:"replies"}]
}
    ]
    })

    if(!post) return next(new Error("post not found",{cause: 404}))


        return res.status(200).json({success:true, data:{ post }})

}

export const activePost = async (req,res,next) => {
        
    let posts

    let {page} =req.query;

    const limit = 4;
    const skip = limit * (page - 1)

    const results = await postModel.find({isDeleted:false}).paginate(page)

    // const cursor = postModel.find({isDeleted:false}).cursor();

    // let results = [];

    // for (let post = await cursor.next(); post != null; post= await cursor.next()){
    //         const comment = await DBservices.find({
    //                 model:commentModel,
    //                 filter:{postId:post._id,isDeleted:false},
    //                 select:"text image -_id"
    //             })
    //             results.push({post,comment})
            
    // }

        return res.status(200).json({success:true, data:{ results }})

}

export const freezeAccount = async (req,res,next) => {
        
    let posts

    if(req.user.role === roleTypes.admin){
        posts = await DBservices.find({
            model:postModel,
            filter:{ isDeleted:false },
            populate:{path:"createdBy",select:"userName images -_id"}
        })
    }else{
        posts = await DBservices.find({
            model:postModel,
            filter:{isDeleted:true,createdBy:req.user._id},
            populate:{path:"createdBy",select:"userName images -_id"}
        })
    }

        return res.status(200).json({success:true, data:{ posts }})
}

export const likeAndUnlike = async (req,res,next) => {

    const{postId} =req.params;
    const userId = req.user._id;
    
    const post = await DBservices.findOne({
        model:postModel,
        filter:{_id:postId,isDeleted:false}
    })

    if(!post) return next(new Error("post not found",{cause: 404}))

        const isUserLike = post.likes.find(
            (user)=> user.toString() === userId.toString()
        )

        if (!isUserLike) {
            post.likes.push(userId)
        }
        else{
            post.likes =post.likes.filter((user) => user.toString() !== userId.toString())
        }

        await post.save();

        const populatedusers = await DBservices.findOne({
            model:postModel,
            filter:{_id:postId,isDeleted:false},
        })
        populate:[{path:"likes",select:"userName images -_id"}]

        return res.status(200).json({success:true, data:{ populatedusers }})
}


