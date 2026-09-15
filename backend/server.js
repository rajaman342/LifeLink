const express=require('express');
const connectDb=require("./config/database");
const authRoutes=require("./routes/authRoutes");
const userRoutes=require("./routes/userRoutes");
const emergencyRoutes=require("./routes/emergencyRoutes");
const aiRoutes = require("./routes/aiRoutes");

const hospitalRoutes=require("./routes/hospitalRoutes");

const notificationRoutes = require("./routes/notificationRoutes");
const donorRoutes=require("./routes/donorRoutes");

const adminRoutes=require("./routes/adminRoutes");

const cors=require("cors");
require("dotenv").config();
const app=express();

app.use(express.json());




const PORT=process.env.PORT;
app.get('/',(req,res)=>{
  res.send("Welcome");
});

connectDb();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use("/api/v1/auth",authRoutes);

app.use("/api/v1/user",userRoutes);
app.use(
    "/api/v1/ai",
    aiRoutes
);
app.use("/api/v1/emergency",emergencyRoutes);
app.use("/api/v1/hospital",hospitalRoutes);

app.use("/api/v1/donor",donorRoutes);
app.use("/api/v1/admin",adminRoutes);
app.use(
    "/api/v1/notifications",
    notificationRoutes
);


app.listen(PORT,()=>{
  console.log(`server is running on PORT ${PORT}`);
})