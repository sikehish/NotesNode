import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PW;
const jwtSecret = process.env.JWT_SECRET || '';

export const adminLogin = (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log(email, password, adminEmail, adminPassword)

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({ email }, jwtSecret, { expiresIn: '1h' });

  res.status(200).json({ message: 'Login successful', data:{email: adminEmail, token} });
};
