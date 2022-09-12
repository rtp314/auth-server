import { MongoClient, Collection, Filter, WithId } from "mongodb";

type UserSchema = {
	username: string;
	password: string;
	name?: string;
	age?: number;
	color?: string;
};

const client = new MongoClient(process.env.MONGO_URI!);
let users: Collection<UserSchema>;

client.connect((err, client) => {
	if (err || client === undefined) console.error(err);
	else {
		users = client.db("node_server").collection<UserSchema>("users");
		console.log("connected successfully");
	}
});

async function getUser(query: Filter<UserSchema>) {
	return new Promise<WithId<UserSchema>>(async (resolve, reject) => {
		if (users) {
			const user = await users.findOne(query);
			if (!user) reject("user not found");
			else resolve(user);
		} else {
			reject("database not initialised, please try again later");
		}
	});
}

async function updateUser(query: Filter<UserSchema>, newUserData: any): Promise<void> {
	return new Promise(async (resolve, reject) => {
		if (users) {
			try {
				await users.updateOne(query, { $set: newUserData });
				resolve();
			} catch (err) {
				console.error();
				reject(err);
			}
		} else {
			console.error("database not initialised, please try again later");
			reject();
		}
	});
}
async function addUser(newUserData: UserSchema): Promise<void> {
	return new Promise(async (resolve, reject) => {
		if (users) {
			try {
				await users.insertOne(newUserData);
				resolve();
			} catch (error) {
				console.error(error);
				reject(error);
			}
		} else {
			console.error("database not initialised, please try again later");
			reject();
		}
	});
}

export { users, getUser, updateUser, addUser, UserSchema };
