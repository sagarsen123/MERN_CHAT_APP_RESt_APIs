import User from "../models/user.models.js"
import Message from "../models/message.models.js"
import Cloudinary from "../lib/cloudinary.js"

export const getUserForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password")
        return res.status(200).json({
            message: "Users fetched Successfully",
            data: filteredUsers
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error!!!"
        })
    }

}

export const getMessagesForChat = async (req, res) => {
    try {
        const { id: userToChatId } = req.params
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        })

        return res.status(200).json({
            messages: "Chat Fetched Sucessfully",
            data: messages
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            message: "Internal Server Error !!!"
        })
    }
}

export const sendMessageToUser = async (req, res) => {
    try {
        const { text, image } = req.body
        const { id: receiverId } = req.params
        const senderId = req.user._id

        let imageUrl;
        if (image) {
            const uploadResponse = await Cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            imageUrl
        })

        await newMessage.save();

        // todo: realtime functionality with socket.io goes here
        return res.status(201).json({
            message: "Messge Sent Successfully",
            data: newMessage
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error!!!"
        })
    }
}