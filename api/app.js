import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import testRoute from "./routes/test.route.js"

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:process.env.CLIENT_URL, credentials:true}));


app.use('/api/auth', authRoute);
app.use('/api/test', testRoute);

app.use('/', (req, res) => {
    res.send("Server is running")
});

app.listen(8800, () => {
    console.log("Server started!");
})