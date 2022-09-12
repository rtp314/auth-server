"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt = __importStar(require("bcrypt"));
const jwt_1 = require("../utils/jwt");
const mongodb_1 = require("../utils/mongodb");
const userRouter = express_1.default.Router();
userRouter.get("/login", (req, res) => {
    res.render("login");
});
userRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.time("login");
    const username = req.body.username;
    try {
        const user = yield (0, mongodb_1.getUser)({ username });
        if (user === null)
            return;
        const passwordCorrect = yield bcrypt.compare(req.body.password, user.password);
        console.timeEnd("login");
        if (passwordCorrect) {
            const jwt = yield (0, jwt_1.getJWT)({ username });
            res.setHeader("set-cookie", [`jwt=${jwt}`]);
            res.redirect("/user/secret");
        }
        else {
            res.render("login", { username, error: "Incorrect Password" });
        }
    }
    catch (error) {
        console.timeEnd("login");
        console.error(error);
        res.status(500).send("Sorry, an error occurred");
    }
}));
userRouter.get("/new", (req, res) => {
    res.render("signup");
});
userRouter.post("/new", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.time("signup");
    const username = req.body.username;
    const password = req.body.password;
    const hash = yield bcrypt.hash(password, 10);
    try {
        const user = { username, password: hash };
        yield (0, mongodb_1.addUser)(user);
        const jwt = yield (0, jwt_1.getJWT)({ username });
        res.setHeader("set-cookie", [`jwt=${jwt}`]);
        console.timeEnd("signup");
        res.render("usercreated", { name: username });
    }
    catch (error) {
        console.error(error);
        console.timeEnd("signup");
        res.render("signup", { username, error: "Sorry, please try again" });
    }
}));
userRouter.get("/secret", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jwt = req.cookies.jwt;
        const data = yield (0, jwt_1.verifyJWT)(jwt);
        if (data.username) {
            const dataFromDb = yield (0, mongodb_1.getUser)({ username: data.username });
            res.render("secret", Object.assign({}, dataFromDb));
        }
        else {
            res.render("denied");
        }
    }
    catch (error) {
        res.render("content");
        console.error(error);
    }
}));
userRouter.post("/secret", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jwt = req.cookies.jwt;
    const loginData = yield (0, jwt_1.verifyJWT)(jwt);
    const userData = { name: req.body.name, age: req.body.age, color: req.body.color };
    try {
        yield (0, mongodb_1.updateUser)({ username: loginData.username }, userData);
        res.render("secret", Object.assign(Object.assign({}, userData), { message: "Data updated successfully" }));
    }
    catch (err) {
        res.render("secret", Object.assign(Object.assign({}, userData), { error: err }));
    }
}));
exports.default = userRouter;
