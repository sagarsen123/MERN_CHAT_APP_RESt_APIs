import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.models.js";
import { generateToken } from "../utils/jwt.js";
import bcrypt from 'bcryptjs'

export const signUp = async (req, res) => {

    try {
        const { fullname, email, password } = req.body;
        if (!fullname || !email || !password)
            return res.status(400).json({ "message": "All fields are required" });

        if (password.length < 8) {
            return res.status(401).json({ "message": "Password should contain atleast 8 characters!!!" })
        }

        let userExists = await User.findOne({ email: email })
        if (userExists) {
            return res.status(401).json({ "message": "Email already registered!!" });

        }

        // hash password 
        const salt = await bcrypt.genSalt(10)
        const hashpass = await bcrypt.hash(password, salt)

        // create new user
        const newUser = new User({
            fullname,
            email,
            password: hashpass
        })

        // save new user and generate token for it
        if (newUser) {
            generateToken(newUser._id, res)
            await newUser.save()

            res.status(201).json({
                message: "User created Successfully",
                data: {
                    _id: newUser._id,
                    email: newUser.email,
                    fullname: newUser.fullname,
                    profilePic: newUser.profilepic
                }
            });
        } else {
            res.status(400).json({
                message: "Invalid data!!"
            })
        }

    } catch (err) {
        console.log("Error in signup controller", err)
        res.status(500).json({
            message: "Internal Server Error !!!"
        })
    }

}

export const logIn = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(401).json({
                message: "All fields are required"
            })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({
                message: "Invalid  Credentials"
            })
        }

        const isPasswordCorrect = await bcrypt.compareSync(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid Credentials"
            })
        }

        generateToken(user, res)

        res.status(201).json({
            message: "User Logged in Successfully",
            data: {
                    _id: user._id,
                    email: user.email,
                    fullname: user.fullname,
                    profilePic: user.profilepic
                }
        });
    } catch (err) {
        console.log(err.message)
        res.status(500).json({
            "message": "Internal Server Error"
        })
    }
}

export const logOut = (req, res) => {

    try{
        if(!req.cookies.jwt) {
            return res.status(401).json({
                "message": "User not authorized"
            })
        }
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({
            "message": "User Logged Out Successfully."
        })
    }catch(err){    
        console.log(err.message)
        res.status(500).json({
            "message": "Internal Server Error!!"
        })

    }
}


export const updateProfile = async(req, res) =>{

    try{    
        const {profilePic} = req.body
        const user_id = req.user._id

        if (!profilePic){
            return res.status(400).josn({
                message: "Profile Pic is required !!!"
            })
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        console.log(uploadResponse)
        const updatedUser = await User.findByIdAndUpdate(user_id, {profilepic: uploadResponse.secure_url}, {new: true})
        res.status(200).json({
            data: updatedUser,
            message: "Profile Pic uploaded successfully"
        })
    }catch(error){
        console.log(error.message)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const checkAuth = (req, res) => {
    return res.status(200).json({
        message: "User is authenticated",
        data: req.user
    })
}