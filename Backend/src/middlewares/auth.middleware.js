import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js"

export const verifyJWT =asyncHandler(async(req,res,next)=>{  //since it is middleware therefore next is used / here res is not in use so _ can be used instead
    try {
        const token =req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")  //second method is used when we cannot access cookies
        
        if (!token) {
            throw new ApiError(401,"Unauthorized request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {            
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})