import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';

type TJwtPayload = {
	id: string;
	role: string;
	email: string;
};

// jwt generator
// export const generateJwtToken = (jwtPayload: TJwtPayload, secret: string, expiry: string) => {
// 	return jwt.sign(jwtPayload, secret, { expiresIn: expiry });
// };

export const generateJwtToken = (jwtPayload: TJwtPayload, secret: Secret, expiry: string) => {
	// Use 'as any' or 'as SignOptions' to force the compiler to accept the string
	const options: SignOptions = {
		expiresIn: expiry as any, // This is the simplest fix for the specific 'ms' type conflict
	};

	return jwt.sign(jwtPayload, secret, options);
};

// jwt validator
export const verifyJwtToken = (token: string, secret: string) => {
	return jwt.verify(token, secret);
};
