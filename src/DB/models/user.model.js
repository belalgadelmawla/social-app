import { Schema ,Types,model } from "mongoose";
import mongoose  from "mongoose";
import { hash } from "../../utils/hashing/hash.js";

export const genderTypes = {
    male:"male",
    female:"female"
}

export const roleTypes = {

    superAdmin:"superAdmin",
    admin:"admin",
    user:"user",
}

export const providersTypes = {
    system:"System",
    google:"Google"
}

export const defaultImage = "upload/defaultProfileImage.png";

export const defaultImageCloud = "https://res.cloudinary.com/dtsqhdxut/image/upload/v1741146489/users/67c6fec9bfe66ffd2542d640/profilePicture/r8g0l4e7kcun706xpwcj.png";


export const defaultPublicIdCloud = "users/67c6fec9bfe66ffd2542d640/profilePicture/r8g0l4e7kcun706xpwcj";




const userSchema = new Schema( {
    userName: {
        type: String,
        required:true,
        trim:true,
        minlength:[3,"user msut be at least 3 character"],
        maxlength:[20,"user msut be at most 20 character"]
    },

    email: {
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
    },

    password: {
        type:String,
    },

    providers: {
        type:String,
        enum:Object.values(providersTypes),
        default:providersTypes.system
    },

    gender: {
        type:String,
        enum:Object.values(genderTypes),
        default:genderTypes.male
    },

    role: {
        type:String,
        enum: Object.values(roleTypes),
        default:roleTypes.user
    },

    confirmEmail: {
        type:Boolean,
        default:false
    },

    isDeleted: {
        type:Boolean,
        default:false
    },

    phone:String,
    DOB:Date,
    address:String,
    images: {
        secure_url:{
            type:String,
            default:defaultImageCloud
        },
        public_id:{
            type:String,
            default:defaultPublicIdCloud
        }
    },

    // images: {
    //     type:String,
    //     default:defaultImage
    // },
    // coverImages:[String],
    changeCredentials: Date,
    confirmEmailOTP:String,
    forgetPasswordOTP:String,
    viewers: [
        {
        userId: {type: Types.ObjectId, ref: "user" },
        time:Date,
        count:Number
        }
    ],
    tempEmail:String,
    tempEmailOTP:String,
}
    ,{timestamps:true});

    userSchema.pre("save", function(next) {

        if(this.isModified("password")){
        this.password = hash({plainText:this.password})
        }
        return next()
    })

    export  const userModel = mongoose.models.user || model("user",userSchema)