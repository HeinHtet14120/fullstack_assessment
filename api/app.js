import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import channelRoute from "./routes/channel.route.js";
import messageRoute from "./routes/message.route.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:process.env.CLIENT_URL, credentials:true}));


app.use('/api/auth', authRoute);
app.use('/api/channel', channelRoute);
app.use('/api/messages', messageRoute)

app.use('/', (req, res) => {
    res.send("Server is running")
});

app.listen(8800, () => {
    console.log("Server started!");
})