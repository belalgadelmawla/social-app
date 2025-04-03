import coonectionDB from "./DB/connection.js";
import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/user/user.controller.js";
import commentRouter from "./modules/comment/comment.controller.js";
import adminRouter from "./modules/admin/admin.controller.js";
import postRouter from "./modules/post/post.controller.js";
import globalErrorHandler from "./utils/errorHandling/globalErrorHandler.js";
import notFoundHandler from "./utils/errorHandling/notFoundHandler.js";
import cors from "cors";
import { createHandler } from "graphql-http/lib/use/express";
import { schema } from "./modules/app.graph.js";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";

// const limiter = rateLimit({
//     windowMs:5 * 60 * 1000,
//     limit: 4 , 
//     message:"Too many requests from this IP, please try again later.",
//     statusCode:429,

//     handler:(req,res,next,options) => {
//         return next(new Error(options.message,{cause:options.statusCode}))
//     },
//     legacyHeaders:true,
//     standardHeaders:true,

// });

const bootstrap = async (app, express) => {

    await coonectionDB();

    app.use('/graphql', createHandler({ schema }));

    app.use(cors());


    app.use(express.json());

    // app.use(limiter);

    // app.use(helmet())


    app.use("/uploads", express.static("uploads"))


    app.get("/", (req, res) => res.send("hello world"))

    app.use("/auth", authRouter)
    app.use("/user", userRouter)
    app.use("/post", postRouter)
    app.use("/comment", commentRouter)
    app.use("/admin", adminRouter)

    app.all("*", notFoundHandler)

    app.use(globalErrorHandler);
}

export default bootstrap;