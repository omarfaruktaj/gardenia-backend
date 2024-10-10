import jwt from 'jsonwebtoken';

interface Payload {
  userId: string;
  username?: string;
  email?: string;
  isVerified?: boolean;
  avatar?: string;
  name?: string;
  role?: string;
}

const generateJWT = (data: Payload, secret: string, expireIn: string) => {
  return jwt.sign(data, secret, {
    expiresIn: expireIn,
  });
};

export default generateJWT;
