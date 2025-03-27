import coonectionDB from "./DB/connection.js";
import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/user/user.controller.js";
import commentRouter from "./modules/comment/comment.controller.js";
import adminRouter from "./modules/admin/admin.controller.js";
import postRouter from "./modules/post/post.controller.js";
import globalErrorHandler from "./utils/errorHandling/globalErrorHandler.js";
import notFoundHandler from "./utils/errorHandling/notFoundHandler.js";
import cors from "cors";



const bootstrap = async (app, express) => {

    await coonectionDB();

    app.use(cors());

    // const whiteList = ["http://localhost:3000","http://localhost:4200","http://localhost:5200"];

    // app.use((req,res,next)=> {
    //     if(!whiteList.includes(req.header("origin"))) {
    //         return next(new Error("blocked by cors",{cause:404}))
    //     }

    //     res.header("Access-Control-Allow-origin",req.header("origin"));
    //     res.header("Access-Control-Allow-Methods","*");
    //     res.header("Access-Control-Private-Network",true);

    //     return next()
    // })

    app.use(express.json());

    app.use("/uploads", express.static("uploads"))

    
    app.get("/",(req,res)=> res.send("hello world"))

    app.use("/auth", authRouter)
    app.use("/user", userRouter)
    app.use("/post", postRouter)
    app.use("/comment", commentRouter)
    app.use("/admin", adminRouter)

    app.all("*", notFoundHandler)

    app.use(globalErrorHandler);
}

export default bootstrap;