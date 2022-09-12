import * as jwt from "jsonwebtoken";

export function getJWT(data: any): Promise<string> {
	return new Promise((resolve, reject) => {
		jwt.sign(data, process.env.JWT_KEY!, {}, (err, token) => {
			if (err) reject(err);
			else if (!token) reject();
			else resolve(token);
		});
	});
}

export function verifyJWT(token: string): Promise<any> {
	return new Promise((resolve, reject) => {
		jwt.verify(token, process.env.JWT_KEY!, (err, data) => {
			if (err) reject(err);
			else resolve(data);
		});
	});
}
