import {Router} from "express"
import { registerUser } from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"

const router=Router()

router.route("/register").post(
    //injecting multer middleware
    //this middleware gives access of file like req.files
    upload.fields([
        {
            name:"avatar",  //name of the field should be same in frontend form
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ])
    ,registerUser)

export default router