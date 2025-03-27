import { Router } from "express";
import { allowTo, authentecation } from "../../middlewares/auth.middleware.js";
import { asynHandler } from "../../utils/errorHandling/asyncHandler.js";
import * as commentServices from "./comment.services.js";
import * as commentValidation from "../comment/comment.validate.js"
import { validation } from "../../middlewares/validataion.middleware.js";
import { uploadCloud } from "../../utils/file uploading/multerCloud.js";


const router = new Router({ mergeParams: true })

router.post(
    "/",
    authentecation(),
    allowTo(["user"]),
    uploadCloud().single("image"),
    validation(commentValidation.createCommentSchema),
    asynHandler(commentServices.createComment)
)

router.patch(
    "/:commentId",
    authentecation(),
    allowTo(["user"]),
    uploadCloud().single("image"),
    validation(commentValidation.updateCommentSchema),
    asynHandler(commentServices.updateComment)
)

router.post(
    "/softDeleted/:commentId",
    authentecation(),
    allowTo(["user","admin"]),
    validation(commentValidation.softDeleteCommentSchema),
    asynHandler(commentServices.softDeleteComment)
)

router.get(
    "/",
    authentecation(),
    allowTo(["user","admin"]),
    validation(commentValidation.getAllCommentSchema),
    asynHandler(commentServices.getAllComment)
)

router.patch("/like_unlike/:commentId",
    authentecation(),
    allowTo(["user"]),
    validation(commentValidation.like_unlikecommentSchema),
    asynHandler(commentServices.likeAndUnlike)
)

router.post("/:commentId",
    authentecation(),
    allowTo(["user"]),
    uploadCloud().single("image"),
    validation(commentValidation.addReplySchema),
    asynHandler(commentServices.addReply)
)

router.delete("/:commentId",
    authentecation(),
    allowTo(["user","admin"]),
    uploadCloud().single("image"),
    validation(commentValidation.deleteCommentSchema),
    asynHandler(commentServices.deleteComment)
)



export default router;
