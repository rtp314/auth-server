"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUser = exports.updateUser = exports.getUser = exports.users = void 0;
const mongodb_1 = require("mongodb");
const client = new mongodb_1.MongoClient(process.env.MONGO_URI);
let users;
exports.users = users;
client.connect((err, client) => {
    if (err || client === undefined)
        console.error(err);
    else {
        exports.users = users = client.db("node_server").collection("users");
        console.log("connected successfully");
    }
});
function getUser(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (users) {
                const user = yield users.findOne(query);
                if (!user)
                    reject("user not found");
                else
                    resolve(user);
            }
            else {
                reject("database not initialised, please try again later");
            }
        }));
    });
}
exports.getUser = getUser;
function updateUser(query, newUserData) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (users) {
                try {
                    yield users.updateOne(query, { $set: newUserData });
                    resolve();
                }
                catch (err) {
                    console.error();
                    reject(err);
                }
            }
            else {
                console.error("database not initialised, please try again later");
                reject();
            }
        }));
    });
}
exports.updateUser = updateUser;
function addUser(newUserData) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (users) {
                try {
                    yield users.insertOne(newUserData);
                    resolve();
                }
                catch (error) {
                    console.error(error);
                    reject(error);
                }
            }
            else {
                console.error("database not initialised, please try again later");
                reject();
            }
        }));
    });
}
exports.addUser = addUser;
