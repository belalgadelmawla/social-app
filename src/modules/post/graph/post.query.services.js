import * as dbServices from "../../../DB/DBServices.js"
import { postModel } from "../../../DB/models/post.model.js"

export const getAllPosts = async (parent,args) => {
    const posts = await dbServices.find({
        model:postModel,
        filter:{isDeleted:false}
    })

    return {message:"done",statusCode:200, data:posts}
}