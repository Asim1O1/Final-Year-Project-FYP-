import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoute from "./api/auth/auth.route.js"

const app = express();

// MIDDLEWARES
app.use(
  cors({
    origin: " http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ROUTES
app.use("/api/auth", authRoute)
 

app.get("/", (req, res) => {
  res.status(200).send("MedConnect platform up and running!");
});

export default app;
