import express from "express";
import * as bcrypt from "bcrypt";
import { getJWT, verifyJWT } from "../utils/jwt";
import { getUser, addUser, updateUser, UserSchema } from "../utils/mongodb";
const userRouter = express.Router();

userRouter.get("/login", (req, res) => {
	res.render("login");
});

userRouter.post("/login", async (req, res) => {
	console.time("login");
	const username = req.body.username;
	try {
		const user = await getUser({ username });
		if (user === null) return;
		const passwordCorrect = await bcrypt.compare(req.body.password, user.password);
		console.timeEnd("login");
		if (passwordCorrect) {
			const jwt = await getJWT({ username });
			res.setHeader("set-cookie", [`jwt=${jwt}`]);
			res.redirect("/user/secret");
		} else {
			res.render("login", { username, error: "Incorrect Password" });
		}
	} catch (error) {
		console.timeEnd("login");
		console.error(error);
		res.status(500).send("Sorry, an error occurred");
	}
});

userRouter.get("/new", (req, res) => {
	res.render("signup");
});

userRouter.post("/new", async (req, res) => {
	console.time("signup");
	const username = req.body.username;
	const password = req.body.password;
	const hash = await bcrypt.hash(password, 10);
	try {
		const user = { username, password: hash };
		await addUser(user);
		const jwt = await getJWT({ username });
		res.setHeader("set-cookie", [`jwt=${jwt}`]);
		console.timeEnd("signup");
		res.render("usercreated", { name: username });
	} catch (error) {
		console.error(error);
		console.timeEnd("signup");
		res.render("signup", { username, error: "Sorry, please try again" });
	}
});

userRouter.get("/secret", async (req, res) => {
	try {
		const jwt = req.cookies.jwt;
		const data = await verifyJWT(jwt);
		if (data.username) {
			const dataFromDb = await getUser({ username: data.username });
			res.render("secret", { ...dataFromDb });
		} else {
			res.render("denied");
		}
	} catch (error) {
		res.render("content");
		console.error(error);
	}
});

userRouter.post("/secret", async (req, res) => {
	const jwt = req.cookies.jwt;
	const loginData = await verifyJWT(jwt);
	const userData = { name: req.body.name, age: req.body.age, color: req.body.color };
	try {
		await updateUser({ username: loginData.username }, userData);
		res.render("secret", { ...userData, message: "Data updated successfully" });
	} catch (err) {
		res.render("secret", { ...userData, error: err });
	}
});

export default userRouter;
