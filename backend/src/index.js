import express from "express"
import authRoutes from "./routes/auth.routes.js";
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import connectToDb from "./lib/db.js";
import cors from 'cors'
import messageRoutes from "./routes/message.routes.js";
import {app, server } from "./lib/socket.js"

dotenv.config()

app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(cookieParser())

// // routes
app.use(express.json({limit:'10mb'}))
app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)

app.get('/health', (req, res)=>{
    res.json("health check is complete...")
})


const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=> {
    console.log(`Server running on ${PORT}`)
    connectToDb()
}); 