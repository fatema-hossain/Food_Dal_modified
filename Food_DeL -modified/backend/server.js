import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import sslcommerzRouter from './routes/sslcommerz.js';

import "dotenv/config"; // Correct usage




// App config
const app = express();
const port = 4000;

// Middleware
app.use(express.json());
app.use(cors());

// DB connection
connectDB();

// API endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static('uploads'));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);




app.get("/", (req, res) => {
    res.send("API Working");
});


app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});


//mongodb+srv://fatemahossain:1234567890@cluster0.osb6toh.mongodb.net/?

app.use(express.urlencoded({ extended: true }));

app.use('/api/sslcommerz', sslcommerzRouter);