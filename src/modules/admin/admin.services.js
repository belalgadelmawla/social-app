import * as DBservices from "../../DB/DBServices.js"
import { providersTypes, roleTypes, userModel } from "../../DB/models/user.model.js";
import { postModel } from "../../DB/models/post.model.js";


export const getAllUsersAndPosts = async (req,res,next) => {
    
    const results =await Promise.all([  DBservices.find({
        model: postModel,
        filter: {}
    }) , DBservices.find({
        model: userModel,
        filter: {}}) ])
        
        return res.status(200).json({success:true , data:results})
    }

    export const changeRole = async (req,res,next) => {
    
        const {role, userId } = req.body;
    
        const user = await DBservices.findOneAndUpdate({
            model:userModel,
            filter: {_id:userId},
            data:{role},
            options:{new:true}
        })
    
    
        return res.status(200).json({success:true , data:user})
    }