import { userModel } from "../../DB/models/user.model.js"; 
import { verifyToken } from "../../utils/token/token.js";
import * as DBservices from "../../DB/DBServices.js"

export const roleTypes = {
    user: "user",
    admin: "admin"
}

export const tokenTypes = {
    access : "access",
    refresh: "refresh"
    
}

export const authentecation = async ({ 
    authorization = "",
    tokenType = tokenTypes.access,
    accessRole =[] }) => {
    const [bearer, token] = authorization.split(" ") || [];


    if (!bearer || !token) throw new Error("invalid token")

    let access_signature, refresh_signature;

    switch (bearer) {
        case "admin":
            access_signature = process.env.ADMIN_ACCESS_TOKEN;
            refresh_signature = process.env.ADMIN_REFRESH_TOKEN;
            break;
        case "user":
            access_signature = process.env.USER_ACCESS_TOKEN;
            refresh_signature = process.env.USER_REFRESH_TOKEN;
            break;
        default:
            throw new Error("user Not Found",{cause:404})
    }


    const decoded = verifyToken({
        token,
        signature: tokenType === tokenTypes.access ? access_signature : refresh_signature,
    });

    const user = await DBservices.findOne({
        model: userModel,
        filter: { _id: decoded.id, isDeleted: false },
    });

    if (!user) throw new Error("invalid token",{cause:400})

    if(!accessRole.includes(user.role)) throw new Error("forbidden",{cause:404})

    return user;
};
