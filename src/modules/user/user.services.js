import * as DBservices from "../../DB/DBServices.js"
import { defaultImage, defaultImageCloud, defaultPublicIdCloud, userModel } from "../../DB/models/user.model.js";
import { emailEmitter } from "../../utils/email/emailEvent.js";
import { compare, hash } from "../../utils/hashing/hash.js";
import path from "path";
import fs from "fs"
import cloudinary from "../../utils/file uploading/cloudinaryConfig.js";


export const getProfile = async (req,res,next) => {

    const user = await DBservices.findOne({
        model:userModel,
        filter: { _id: req.user._id},
        populate:[{ path: "viewers.userId", select: "userName email image"}],
    })
    
    return res.status(200).json({success:true, user }) 
}

export const shareProfile = async (req, res, next) => {
    const { profileId } = req.params;
    let user = undefined;

    if (profileId === req.user._id.toString()) {
        user = req.user;
    } else {
        user = await DBservices.findOneAndUpdate({
            model: userModel,
            filter: {
                _id: profileId,
                isDeleted: false,
                "viewers.userId": req.user._id, 
            },
            data: {
                $set: { "viewers.$.time": Date.now() }, 
                $inc: { "viewers.$.count": 1 } 
            },
            select: "userName email images viewers"
        });

        if (!user) {
            
            user = await DBservices.findOneAndUpdate({
                model: userModel,
                filter: { _id: profileId, isDeleted: false },
                data: {
                    $push: {
                        viewers: {
                            userId: req.user._id,
                            time: Date.now(),
                            count: 1 
                        }
                    }
                },
                select: "userName email images viewers"
            });
        }
    }

    return user
        ? res.status(200).json({ success: true, data: { user } })
        : next(new Error("User not found", { cause: 404 }));
}

export const updateEmail = async (req, res, next) => {
    const { email } = req.body;

    if(await DBservices.findOne({model:userModel,filter:{email}}))
        return next(new Error("email is already exist",{cause:409}))

    await DBservices.updateOne({
        model:userModel,
        filter:{ _id: req.user._id },
        data:{ tempEmail: email }
    })
    emailEmitter.emit(
        "sendEmail",
        req.user.email,
        req.user.userName,
        req.user._id
    )
    emailEmitter.emit(
        "updateEmail",
        email,
        req.user.userName,
        req.user._id
    )
    
    
        return res.status(200).json({ success: true, messuge: "emails sent successfully" })
        
}

export const resetEmail = async (req, res, next) => {
    const { oldCode , newCode } = req.body;



const isOldCodeValid =  compare({ plainText: oldCode, hash: req.user.confirmEmailOTP });
const isNewCodeValid =  compare({ plainText: newCode, hash: req.user.tempEmailOTP });


    if (!isOldCodeValid || !isNewCodeValid) {
        return next(new Error("invalid code", { cause: 400 }));
    }

    const user = await DBservices.updateOne({
        model: userModel,
        filter: { _id: req.user._id }, 
        data: {
            email: req.user.tempEmail,
            changeCredentials: Date.now(),
            $unset: { tempEmail: "", tempEmailOTP: "", confirmEmailOTP: "" }
        }
    });

        return res.status(200).json({ success: true, data:{ user } })
}

export const updatePassword = async (req, res, next) => {
    const { oldPassword,password } = req.body;

    const isOldPasswordValid =  compare({ plainText: oldPassword, hash: req.user.password });

    if (!isOldPasswordValid) {
        return next(new Error("invalid password", { cause: 400 }));
    }

    const user = await DBservices.updateOne( {
        model:userModel,
        filter:{_id:req.user._id},
        data:{password:hash({plainText:password}),
        changeCredentials:Date.now()
    }
    })


        return res.status(200).json({ success: true, message:"password updated successfully" })
}

export const updateProfile = async (req, res, next) => {

    const user = await DBservices.updateOne( {
        model:userModel,
        filter:{_id:req.user._id},
        data:req.body,
        options:{new:true, runValidator:true}
    })


        return res.status(200).json({ success: true, results:{user} })
}

export const uploadImageDisk = async (req, res, next) => {

    const user = await DBservices.findByIdAndUpdate({
        model:userModel,
        id:{_id:req.user._id},
        data:{images:req.file.path},
        options: {new : true}
    })

        return res.status(200).json({ success: true, data: {user} })
}

export const uploadMultilpleImages = async (req, res, next) => {
    
    const user = await DBservices.findByIdAndUpdate({
        model:userModel,
        id:{_id:req.user._id},
        data:{coverImages:req.files.map((obj) => obj.path)},
        options: {new : true}
    })
    
    return res.status(200).json({ success: true, data: {user} })
}

export const deleteProfilePcture = async (req, res, next) => {
    
    const user = await DBservices.findOne({
        model:userModel,
        id: { _id: req.user._id}
    })
    
    const imagePath = path.resolve(".",user.images);
    
    fs.unlinkSync(imagePath)
    
    
    user.images = defaultImage;
    
    await user.save()
    
    
    return res.status(200).json({ success: true, data: {user} })
}

export const uploadImageOnCloud = async (req, res, next) => {

    const user = await DBservices.findOne({
        model:userModel,
        id: { _id: req.user._id}
    })
    
    const {secure_url , public_id} = await cloudinary.uploader.upload(req.file.path, {
        folder:`users/${user._id}/profilePicture`
    })

    user.images ={secure_url , public_id}

    await user.save();


        return res.status(200).json({ success: true, data: {user} })
}

export const deleteImageOnCloud = async (req, res, next) => {

    const user = await DBservices.findOne({
        model:userModel,
        id: { _id: req.user._id}
    })
    
    const results = await cloudinary.uploader.destroy( user.images.public_id )

    if(results.result === "ok") {
        user.images ={ 
        secure_url:defaultImageCloud,
        public_id:defaultPublicIdCloud
        }
    }

    await user.save();


        return res.status(200).json({ success: true, data: {results} })
}

