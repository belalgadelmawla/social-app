import { Router } from "express";
import * as adminServices from "./admin.services.js"
import { asynHandler } from "../../utils/errorHandling/asyncHandler.js";
import { validation } from "../../middlewares/validataion.middleware.js";
import * as adminvalidation from "./admin.validate.js";
import { allowTo, authentecation } from "../../middlewares/auth.middleware.js";
import { changeRole } from "./admin.middleware.js";


const router = Router();

router.get(
    "/getAll",
    authentecation(),
    allowTo(["admin"]),
    asynHandler(adminServices.getAllUsersAndPosts)
)

router.patch(
    "/role",
    authentecation(),
    allowTo(["admin"]),
    validation(adminvalidation.changeRoleSchema),
    changeRole,
    asynHandler(adminServices.changeRole)
    

)



export default router;