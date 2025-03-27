import { Router } from "express";
import * as authRouter from "./auth.services.js"
import { asynHandler } from "../../utils/errorHandling/asyncHandler.js";
import { validation } from "../../middlewares/validataion.middleware.js";
import * as authvalidation from "../auth/auth.validate.js"
import { authentecation } from "../../middlewares/auth.middleware.js";


const router = Router();

router.post("/register",
    validation(authvalidation.registerSchema),
    asynHandler(authRouter.register),
)

router.post("/login",
    validation(authvalidation.loginSchema),
    asynHandler(authRouter.login),
)
router.get("/refresh_token",
    asynHandler(authRouter.refresh_token),
)

router.patch("/confirmEmail",
    validation(authvalidation.confirmEmailSchema),
    asynHandler(authRouter.confirmEmail),
)

router.patch("/forget_password",
    validation(authvalidation.forgetPasswordschema),
    asynHandler(authRouter.forgetPassword),
)

router.patch("/reset_password",
    validation(authvalidation.resetPasswordschema),
    asynHandler(authRouter.resetPassword),
)

router.post("/loginWithGmail",
    asynHandler(authRouter.loginWithGmail),
)


export default router;