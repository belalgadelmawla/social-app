import * as dbservice from "../../../DB/DBServices.js"
import { postModel } from "../../../DB/models/post.model.js";

export const likePost = async (parent,args)=> {
    const {postId , authorization} = args;

    const post = await dbservice.findOneAndUpdate({
        model:postModel,
        filter:{_id:postId},
        data:{$addToSet:{likes: user._id }},
        options:{new:true}
    })

    return {message:"done", statusCode:200 , data: post}
}