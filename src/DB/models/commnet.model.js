import { Schema ,Types,model } from "mongoose";
import mongoose  from "mongoose";
import cloudinary from "../../utils/file uploading/cloudinaryConfig.js";



const commentSchema = new Schema( {

    text: {
        type:String,
        minLength:2,
        maxLength: 5000,
        trim: true,
        required: function () {
        return this.image?.length ? false : true;
        }
    },

    image: {
        secure_url: String,
        public_id:String
    },
    createdBy:{
        type: Types.ObjectId,
        ref:"user",
        required:true
    },

    postId:{
        type: Types.ObjectId,
        ref:"post",
        required:true
    },

    deletedBy:{
        type: Types.ObjectId,
        ref:"user",
    },
    likes:[{
        type: Types.ObjectId,
        ref:"user"
    }],
    isDeleted: {
        type:Boolean,
        default:false
    },
    parentComment: {
        type:Types.ObjectId,
        ref:"comment"
    }
}
    ,{timestamps:true, toJSON: {virtuals:true} , toObject:{virtuals:true}})

    commentSchema.post("deleteOne", {document:true,query:false} ,async function(doc,next) {

        if(doc.image.secure_url) {
            await cloudinary.uploader.destroy(doc.image.public_id)
        }

        const replies = await this.constructor.find({parentComment:doc._id})

        if(replies.length > 0 ){
            for (const reply of replies) {
                await reply.deleteOne();
            }
        }

        return next();

    })

    commentSchema.virtual("replies", {
        ref:"comment",
        localField:"_id",
        foreignField:"parentComment"
    })

    export  const commentModel = mongoose.models.comment || model("comment",commentSchema)