import { userModel } from "../DB/models/user.model.js"; 
import { refresh_token } from "../modules/auth/auth.services.js";
import { asynHandler } from "../utils/errorHandling/asyncHandler.js";
import { verifyToken } from "../utils/token/token.js";
import * as DBservices from "../DB/DBServices.js"

export const roleTypes = {
    user: "user",
    admin: "admin"
}

export const tokenTypes = {
    access : "access",
    refresh: "refresh"
    
}

export const decodedToken = async ({ authorization = "", tokenType = tokenTypes.access, next = {} }) => {
    const [bearer, token] = authorization.split(" ") || [];


    if (!bearer || !token) return next(new Error("Invalid token", { cause: 400 }));

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
            return next(new Error("Invalid token type", { cause: 400 }));
    }


    const decoded = verifyToken({
        token,
        signature: tokenType === tokenTypes.access ? access_signature : refresh_signature,
    });

    const user = await DBservices.findOne({
        model: userModel,
        filter: { _id: decoded.id, isDeleted: false },
    });

    if (!user) return next(new Error("User does not exist", { cause: 400 }));

    return user;
};


export const authentecation = () => {

    return asynHandler(async (req,res,next) => {
        const {authorization} = req.headers;

        req.user = await decodedToken({authorization,tokenType:tokenTypes.access,next})

        return next();
    });
}



export const allowTo = (roles = []) => {

    return asynHandler( async (req, res, next) => {

        if (!roles.includes(req.user.role)) return next(new Error("forbidden account", { cause: 403 }))

        return next();

    })
}