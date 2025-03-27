import { roleTypes, userModel } from "../../DB/models/user.model.js";
import * as dbServices from "../../DB/DBServices.js"


export const changeRole = async (req,res,next) => {

    const allRoles = Object.values(roleTypes)

    const userReq = req.user;

    const targetUser = await dbServices.findById({
        model:userModel,
        id:{_id:req.body.userId}
    })

    const userReqRole = userReq.role;

    const targetUserRole = targetUser.role;

    const userReqIndex = allRoles.indexOf(userReqRole);
    const taragetUserIndex = allRoles.indexOf(targetUserRole);

    const canModify = userReqIndex < taragetUserIndex;

    if(!canModify) {
        return next(new Error("unauthorized", {cause:404}))
    }

    return next();
}