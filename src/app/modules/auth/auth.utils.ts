import jwt from 'jsonwebtoken';

type TJwtPayload = {
  id: string;
  role: string;
  email: string;
};

// jwt generator
export const generateJwtToken = (
  jwtPayload: TJwtPayload,
  secret: string,
  expiry: string,
) => {
  return jwt.sign(jwtPayload, secret, { expiresIn: expiry });
};

// jwt validator
export const verifyJwtToken = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};
