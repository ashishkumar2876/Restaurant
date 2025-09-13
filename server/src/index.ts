import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/connectDB';
import userRoute from './routes/user.route';
import restaurantRoute from './routes/restaurant.route';
import orderRoute from './routes/order.route';
import menuRoute from './routes/menu.route';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

dotenv.config({});

const app = express();
const PORT = process.env.PORT;

app.set("trust proxy", 1);

app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
    origin: 'https://restaurant-2-4xp5.onrender.com',
    credentials: true
};
app.use(cors(corsOptions));

// Serve frontend static files
const frontendPath = path.join(__dirname, '../client/dist'); // Adjust path if needed

app.use(express.static(frontendPath));

// API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/restaurant", restaurantRoute);
app.use("/api/v1/menu", menuRoute);
app.use("/api/v1/order", orderRoute);

// For all other routes, serve index.html (React router support)
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`);
});

