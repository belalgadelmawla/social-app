import { model } from "mongoose";
import * as DBservices from "../../DB/DBServices.js"
import { providersTypes, roleTypes, userModel } from "../../DB/models/user.model.js";
import { emailEmitter } from "../../utils/email/emailEvent.js";
import { encrypt } from "../../utils/encryption/encryption.js";
import { compare , hash } from "../../utils/hashing/hash.js";
import { generateToken, verifyToken } from "../../utils/token/token.js";
import {OAuth2Client}  from 'google-auth-library';
import { decodedToken, tokenTypes } from "../../middlewares/auth.middleware.js";

export const register = async (req,res,next) => {
    const {password,email,phone} = req.body;
    
    const checkEmail = await DBservices.findOne({model: userModel,filter:{email}})

    if(checkEmail) return next(new Error("user is already exist"),{cause:400})

    // const hashPassword = hash({plainText:password,saltRound:process.env.SALT})

    const encryptedPhone = encrypt({plainText:phone,signature:process.env.SECRET_KEY})

    const user = await DBservices.create({model:userModel,
    data:{
        ...req.body,
        password,
        phone:encryptedPhone
    }})

    emailEmitter.emit("sendEmail",user.email,user.userName)

    return res.status(200).json({success:true, message: "done",results: user })

}

export const login = async (req,res,next) => {
    const {email,password} = req.body;

    const user = await DBservices.findOne({model:userModel,filter: {email} })

    if(!user) return next(new Error("user is not exist"),{cause:400})

    if(user.confirmEmail === false) return next(new Error("email not verfied" , { cause:400 } ))

    const comparePassword = compare({plainText:password ,hash:user.password})

    if(!comparePassword) return next(new Error("incorrect password",{cause:400}))

    const accessToken = generateToken({
        payLoad:{id:user._id},
        signature: 
        user.role == roleTypes.user ?
        process.env.USER_ACCESS_TOKEN : 
        process.env.ADMIN_ACCESS_TOKEN,
        options: {expiresIn: process.env.ACCESS_TOKEN_EXPIRE},
        })

    const refreshToken = generateToken({
        payLoad:{id:user._id},
        signature: 
        user.role == roleTypes.user ?
        process.env.USER_REFRESH_TOKEN : 
        process.env.ADMIN_REFRESH_TOKEN,
        options: {expiresIn: process.env.REFRESH_TOKEN_EXPIRE},
        })

        return res.status(200).json({
            success:true,
            message: "done",
            tokens: {
            accessToken ,
            refreshToken
        }})

}

export const refresh_token = async (req,res,next) => {

    const { authorization } = req.headers;

    const user = await decodedToken({authorization,tokenType:tokenTypes.refresh,next})
    
    const accessToken = generateToken({
        payLoad:{id:user._id},
        signature: 
        roleTypes.user === roleTypes.user ?
        process.env.USER_ACCESS_TOKEN : 
        process.env.ADMIN_ACCESS_TOKEN,
        options: {expiresIn: process.env.ACCESS_TOKEN_EXPIRE},
        })

    const refreshToken = generateToken({
        payLoad:{id:user._id},
        signature: 
        roleTypes.user === roleTypes.user ?
        process.env.USER_REFRESH_TOKEN : 
        process.env.ADMIN_REFRESH_TOKEN,
        options: {expiresIn: process.env.REFRESH_TOKEN_EXPIRE},
        })

    return res.status(200).json({
            success:true,
            message: "done",
            tokens: {
            accessToken ,
            refreshToken
        }})

}

export const confirmEmail = async (req,res,next) => {
    const {code,email} = req.body;

    const user = await DBservices.findOne({model:userModel,filter:{email}})
    
    if(!user) return next(new Error("user is not exist"),{cause:400})

    if(user.confirmEmail === true) return next("email is already verify",{cause:400})

    if(!compare({plainText:code,hash:user.confirmEmailOTP}))
        return next(new Error("invalid code"))

    await DBservices.updateOne({model:userModel,filter:{email},data: {confirmEmail:true,$unset:{confirmEmailOTP: 0 }} })

    return res.status(200).json({success:true, message: "email verified successfully" })

}

export const forgetPassword = async (req,res,next) => {

    const {email} = req.body;

    const user = await DBservices.findOne({model:userModel,filter:{ email, isDeleted:false } })

    if(!user) return next(new Error("user is not exist"),{cause:400})

    emailEmitter.emit("forgetPassword",email,user.userName,user._id)

    return res.status(200).json({success:true, message: "password sent successfully" })

}

export const resetPassword = async (req, res, next) => {
    const { email, code, password } = req.body;

    const user = await DBservices.findOne({ model: userModel, filter: { email, isDeleted: false } });

    if (!user) return next(new Error("User does not exist", { cause: 400 }));



    if (!compare({ plainText: code, hash: user.forgetPasswordOTP })) {
        return next(new Error("Invalid code", { cause: 400 }));
    }


    const hashPassword = hash({ plainText: password });

    await DBservices.updateOne({
        model: userModel,
        filter: { email },
        data: { password: hashPassword, $unset: { confirmEmailOTP: "", forgetPasswordOTP: "" } }
    });


    return res.status(200).json({ success: true, message: "Password reset successfully" });
};

export const loginWithGmail = async (req,res,next)=> {
    const {idToken} = req.body;


    const client = new OAuth2Client();
    async function verify() {
        const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.CLIENT_ID, 
});
    const payload = ticket.getPayload();
    return payload
}
    const {name,picture,email,email_verified} =  await verify();

    
    if(!email_verified)
        return next(new Error("email is not verfied",{cause:401}))
    
    let user = await DBservices.findOne({model:userModel, filter:{ email, isDeleted:false }})

    if(user?.providers === providersTypes.system) 
        return next(new Error("user is already exist",{cause: 404}))

    if(!user) {

        user= await DBservices.create({
            model:userModel,
            data: {
                userName:name,
                email,
                Image:picture,
                confirmEmail:email_verified,
                providers:providersTypes.google
            }
        })
    }

    const accessToken = generateToken({
        payLoad:{id:user._id},
        signature: 
        user.role == roleTypes.user ?
        process.env.USER_ACCESS_TOKEN : 
        process.env.ADMIN_ACCESS_TOKEN,
        options: {expiresIn: process.env.ACCESS_TOKEN_EXPIRE},
        })

    const refreshToken = generateToken({
        payLoad:{id:user._id},
        signature: 
        user.role == roleTypes.user ?
        process.env.USER_REFRESH_TOKEN : 
        process.env.ADMIN_REFRESH_TOKEN,
        options: {expiresIn: process.env.REFRESH_TOKEN_EXPIRE},
        })
    

    return res.status(200).json({success:true, tokens:{
        accessToken,
        refreshToken
    } })
}