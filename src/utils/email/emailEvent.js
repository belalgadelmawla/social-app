import { EventEmitter } from "events";
import { subject } from "./sendemail.js";
import sendEmail from "./sendemail.js";
import { signUp } from "./generateHtml.js";
import { customAlphabet } from "nanoid";
import { hash } from "../hashing/hash.js";
import { userModel } from "../../DB/models/user.model.js";
import * as DBservices from "../../DB/DBServices.js"


export const emailEmitter = new EventEmitter();

emailEmitter.on("sendEmail", async (email,userName,id)=> {

    await sendCode({
        data:{email,userName,id},
        subjectType:subject.register
    })
})


emailEmitter.on("forgetPassword", async (email, userName, id) => {
    await sendCode({
        data: { email, userName, id }, 
        subjectType: subject.resetPassword
    });
});


emailEmitter.on("updateEmail", async (email,userName,id)=> {
    await sendCode({
        data:{email,userName,id},
        subjectType:subject.updateEmail
    })
})

export const sendCode = async (
    { data = {}, subjectType = subject.register } = {}
) => {
    

    const { email, userName, id } = data; 

    const OTP = customAlphabet("0123456", 5)();
    const hashOTP = hash({ plainText: OTP });

    let updatedData = {};
    switch (subjectType) {
        case subject.register:
            updatedData = { confirmEmailOTP: hashOTP };
            break;
        case subject.resetPassword:
            updatedData = { forgetPasswordOTP: hashOTP };
            break;
        case subject.updateEmail:
            updatedData = { tempEmailOTP: hashOTP };
            break;
        default:
            break;
    }

    await DBservices.updateOne({
        model: userModel,
        filter: { _id: id },
        data: updatedData
    });



    const isSent = await sendEmail({
        to: email,
        subject: subjectType,
        html: signUp(OTP, userName, subjectType)
    });

};

