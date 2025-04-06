import express from 'express'
import dotenv from 'dotenv'
import connectDB from './db/connectDB';
import userRoute from './routes/user.route'
import restaurantRoute from './routes/restaurant.route'
import orderRoute from './routes/order.route'
import menuRoute from './routes/menu.route'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path';
dotenv.config({});

const app=express();
const PORT=process.env.PORT || 3000;

const DIRNAME=path.resolve();

//default middleware for a mern project
app.use(bodyParser.json({limit:'10mb'}));
app.use(express.urlencoded({extended:true,limit:'10mb'}));
app.use(express.json({}));
app.use(cookieParser());
const corsOptions={
    origin:'http://localhost:5173',
    credentials:true
}
app.use(cors(corsOptions));

app.use("/api/v1/user",userRoute);
app.use("/api/v1/restaurant",restaurantRoute);
app.use("/api/v1/menu",menuRoute);
app.use("/api/v1/order",orderRoute);

app.use(express.static(path.join(DIRNAME, 'client', 'dist')));
app.use("*",(_,res)=>{
    res.sendFile(path.resolve(DIRNAME,"client","dist","index.html"));
});
//http://localhost:8000/api/v1/user/signup

app.listen(PORT,()=>{
    connectDB();
    console.log(PORT);
})