import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
    //get user details from frontend
    const { fullName, email, username, password } = req.body;
    console.log(email);

    //validate the details:
    //fields should not be empty,we can add other validations also ,generally validations are written in separate file
    if (
        [fullName, email, username, password].some(
            (field) => field?.trim() === ""
        )
    ) {
        console.log("validation error");
        throw new ApiError(400, "All fields are required");
    }

    //check if user exists or not :username , email
    const existedUser=await User.findOne({
        $or:[{username},{email}]
    })

    if (existedUser) {
        throw new ApiError(409,"User with email or username already existed");
    }

    //check for images: avatar,coverImage
    const avatarLocalPath=req.files?.avatar[0]?.path  //req.files is provided by multer
    const coverImageLocalPath=req.files?.coverImage[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400,"Avatar file is required")
    }

    //upload image on cloudinary
    const avatar=await uploadOnCloudinary(avatarLocalPath)
    console.log(avatar);
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)
    if (!avatar) {
        throw new ApiError(400,"Avatar file is not uploaded")
    }

    //create user object :create entry in db
    const user=await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })
   
    //check if user is created or not and removing password and refreshToken
    const createdUser= await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500,"Something went wrong while registering user")
    }

    //res
    return res.status(201).json(
        new ApiResponse(200,createdUser,"user registered successfully")
    )
});

export { registerUser };
