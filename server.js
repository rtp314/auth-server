"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const userLogin_1 = __importDefault(require("./routes/userLogin"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.set("view engine", "pug");
app.use(express_1.default.static(path_1.default.join(__dirname, "/public")));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use("/user", userLogin_1.default);
app.get("/", (req, res) => {
    res.render("main");
});
app.get("/test", (req, res) => {
    res.status(200).send({ test: "data" });
});
exports.default = app;
