import "dotenv/config";
import express from "express";
import path from "path";
import userRouter from "./routes/userLogin";
import cookieParser from "cookie-parser";
const app = express();

app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/user", userRouter);

app.get("/", (req, res) => {
	res.render("main");
});

app.get("/test", (req, res) => {
	res.status(200).send({ test: "data" });
});

export default app;
