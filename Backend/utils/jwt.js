import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';
configDotenv();
const SECRET = process.env.JWT_SECRET;

export const generateToken = (payload) => jwt.sign(payload, SECRET, { expiresIn: "2h" });
export const verifyToken = (token) => jwt.verify(token, SECRET);
