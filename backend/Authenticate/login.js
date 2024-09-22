import { Admin } from "../models/admin.js";
import dotenv from 'dotenv';
dotenv.config();
import  jwt  from 'jsonwebtoken'



export const Token = async (req, res, next) => {
    const token = req.cookies.token;
  
    if (!token) {
        console.log('varata')
      return next();
    }
  
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Token expired or invalid' });
      }
  
      const user = await Admin.findById(decoded.id); 
      if (!user) {
        return res.status(403).json({ message: 'User not found' });
      }
  
      res.json({ message: 'Already logged in', token });
    });
  };


