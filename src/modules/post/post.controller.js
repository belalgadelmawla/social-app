import { Router } from "express";
import { allowTo, authentecation } from "../../middlewares/auth.middleware.js";
import { asynHandler } from "../../utils/errorHandling/asyncHandler.js";
import * as postServices from "./post.services.js";
import * as postValidation from "../post/post.validate.js"
import { validation } from "../../middlewares/validataion.middleware.js";
import { uploadCloud } from "../../utils/file uploading/multerCloud.js";
import commentRouter from "../comment/comment.controller.js";


const router = new Router()

router.use("/:postId/comment",commentRouter)

router.post("/create",
    authentecation(),
    allowTo(["user"]),
    uploadCloud().array("images", 5),
    validation(postValidation.createPostSchema),
    asynHandler(postServices.createPost)
    )

router.patch("/update/:postId",
    authentecation(),
    allowTo(["user"]),
    uploadCloud().array("images", 5),
    validation(postValidation.updatePostSchema),
    asynHandler(postServices.updatePost)
    )

router.patch("/softDelete/:postId",
    authentecation(),
    allowTo(["user","admin"]),
    validation(postValidation.softDeleteSchema),
    asynHandler(postServices.softDelete)
    )

router.patch("/restorePost/:postId",
    authentecation(),
    allowTo(["user","admin"]),
    validation(postValidation.restorePostSchema),
    asynHandler(postServices.restorePost)
    )

router.get("/getSinglePost/:postId",
    authentecation(),
    allowTo(["user","admin"]),
    validation(postValidation.getSinglePostSchema),
    asynHandler(postServices.getSinglePost)
    )

router.get("/activePosts",
    authentecation(),
    allowTo(["user", "admin"]),
    asynHandler(postServices.activePost)
    )

router.get("/freezeAccount",
    authentecation(),
    allowTo(["user","admin"]),
    asynHandler(postServices.freezeAccount)
    )

router.patch("/like_unlike/:postId",
    authentecation(),
    allowTo(["user"]),
    validation(postValidation.like_unlikePostSchema),
    asynHandler(postServices.likeAndUnlike)
    )

export default router;
