import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';


export interface AuthReq extends Request {
    user: string;
  }


export const checkAuth = (req: Request, res: Response, next: NextFunction): Response | void => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ status: "fail", message: 'Unauthorized access. Invalid Bearer token.' });
    }
    console.log(token)
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_KEY as jwt.Secret);
      console.log(decodedToken)
  
      if (!decodedToken || typeof decodedToken !== 'object' || !decodedToken.email) {
        return res.status(401).json({ status: "fail", message: "Invalid token format" });
      }

  
      const { email } = decodedToken;
      ((req as unknown) as AuthReq).user = email;
      
      next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({ status: "fail", message: 'Unauthorized access.' }) as Response;
    }
  };
  