import * as dotenv from 'dotenv';
dotenv.config();
import express from "express";
import connectDB from './connection.js';
import cors from "cors";
import authRoute from "./routes/auth.route.js";
import competitionRoute from "./routes/competition.route.js"



const app = express();

connectDB();


app.use(cors());

app.use(express.urlencoded({ extended: true }));


app.use(express.json());


app.use("/auth", authRoute);

app.use("/competition", competitionRoute);


const PORT = 5000;



app.listen(PORT, () => {
    console.log(`App running at http://localhost:${PORT}/`);
})