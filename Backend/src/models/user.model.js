import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //cloudinary url
      required: true,
    },
    coverImage: {
      type: String, //cloudinary url
      required: true,
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

//pre hook is used to preform action just before saving data in db
//here do not use arrow fn bcoz we need reference of parent i.e. userSchema
//next bcoz it is middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();  
  this.password = await bcrypt.hash(this.password, 10); //here 10 round of salting is done
  next();
});

//custom method to check the password
userSchema.methods.isPasswordCorrect=async function (password) {
  return await bcrypt.compare(password,this.password)
  //returns boolean
}

//method to generate access token
userSchema.methods.generateAccessToken=function() {
  jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}

//method to generate refresh token
userSchema.methods.generateRefreshToken= function() {
  jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}
export const User = mongoose.model("User", userSchema);
