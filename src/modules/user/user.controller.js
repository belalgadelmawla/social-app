import { Router } from "express";
import { authentecation } from "../../middlewares/auth.middleware.js";
import { asynHandler } from "../../utils/errorHandling/asyncHandler.js";
import * as userServices from "./user.services.js";
import * as userValidation from "../user/user.validate.js"
import { validation } from "../../middlewares/validataion.middleware.js";
import { fileValidation, upload } from "../../utils/file uploading/fileUpload.js";
import { uploadCloud } from "../../utils/file uploading/multerCloud.js";

const router = new Router()

router.get(
    "/profile",
    authentecation(),
    asynHandler(userServices.getProfile)
)

router.get(
    "/profile/:profileId",
    authentecation(),
    validation(userValidation.shareProfileShema),
    asynHandler(userServices.shareProfile)
)

router.patch(
    "/profile/email",
    authentecation(),
    validation(userValidation.updateEmailSchema),
    asynHandler(userServices.updateEmail)
)

router.patch(
    "/profile/reset_email",
    authentecation(),
    validation(userValidation.resetEmailSchema),
    asynHandler(userServices.resetEmail)
)

router.patch("/update_password",
    authentecation(),
    validation(userValidation.updatePasswordSchema),
    asynHandler(userServices.updatePassword)
)

router.patch("/profile/update_profile",
    authentecation(),
    validation(userValidation.updateProfileSchema),
    asynHandler(userServices.updateProfile)
)

router.post("/profilePicture",
    authentecation(),
    upload(fileValidation.images,"upload/user").single("image"),
    asynHandler(userServices.uploadImageDisk)
)

router.post("/multipleImgs",
    authentecation(),
    upload(fileValidation.images,"upload/user").array("images", 3),
    asynHandler(userServices.uploadMultilpleImages)
)

router.delete("/deleteProfilePcture",
    authentecation(),
    upload(fileValidation.images,"upload/user").single("image"),
    asynHandler(userServices.deleteProfilePcture)
)

router.delete("/deleteProfilePctureCloud",
    authentecation(),
    uploadCloud().single("image"),
    asynHandler(userServices.deleteImageOnCloud)
)

router.post("/uploadCloud",
    authentecation(),
    uploadCloud().single("image"),
    asynHandler(userServices.uploadImageOnCloud)
)

export default router;



