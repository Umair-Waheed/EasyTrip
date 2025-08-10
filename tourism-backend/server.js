import express from "express"
import cors from "cors"
import {connectDB} from "./config/db.js";
import adminRoutes from "./routes/adminRoute.js"
import userRoutes from "./routes/userRoute.js"
import providerRoutes from "./routes/serviceProviderRoute.js"
import hotelRoutes from "./routes/hotelRoute.js"
import transportRoutes from "./routes/transportRoute.js" 
import guideRoutes from "./routes/guideRoute.js"
import bookingRoutes from "./routes/bookingRoute.js";
import destRoutes from "./routes/destListingRoute.js";
import publicRoutes from "./routes/publicRoutes.js";
import reviewRouter from "./routes/reviewRoute.js"
import paymentRouter from "./routes/paymentRoute.js";
import refundRouter from "./routes/refundRoute.js"
import notificationRouter from "./routes/notificationRoute.js";
import reportRouter from "./routes/reportRoutes.js";
const app = express();
const port = 4000;

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))

//connect database
connectDB();

//route
app.get("/", (req, res) => {
    res.send("Route is working");
})

// backend api endpoints
app.use("/api/admin",adminRoutes);
app.use("/api",destRoutes);
app.use("/api/user",userRoutes);
app.use("/api/serviceprovider",providerRoutes);
app.use("/api/hotel",hotelRoutes);
app.use("/api/transport",transportRoutes);
app.use("/api/guide",guideRoutes);
app.use("/api",bookingRoutes);
app.use("/api/publicRoute",publicRoutes);
app.use("/api/reviews",reviewRouter);
app.use("/api/payment",paymentRouter);
app.use("/api/refund",refundRouter);
app.use("/api/notifications",notificationRouter);
app.use("/api/reports",reportRouter);


app.listen(port,()=>{
    console.log(`app is listing on ${port} port`);
})