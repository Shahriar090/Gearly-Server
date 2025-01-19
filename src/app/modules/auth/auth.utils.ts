import jwt from 'jsonwebtoken';

type TJwtPayload = {
  id: string;
  role: string;
};

export const generateJwtToken = (
  jwtPayload: TJwtPayload,
  secret: string,
  expiry: string,
) => {
  return jwt.sign(jwtPayload, secret, { expiresIn: expiry });
};
