import * as dbservice from "../../../DB/DBServices.js"
import { postModel } from "../../../DB/models/post.model.js";
import { roleTypes } from "../../../DB/models/user.model.js";
import { authentecation } from "../../../middlewares/graph/graph.auth.middleware.js";

export const likePost = async (parent,args)=> {
    const {postId , authorization} = args;

    const user = await authentecation({authorization,accessRole:roleTypes.user})

    const post = await dbservice.findByIdAndUpdate({
        model:postModel,
        id:{_id:postId},
        data:{$addToSet:{likes: user._id }},
        options:{new:true}
    })

    return {message:"done", statusCode:200 , data: post}
}