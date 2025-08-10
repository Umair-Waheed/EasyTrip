import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    // console.log(token);

    if (!token) {
      return res.json({ message: 'Access denied, token not provided!' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.json({ message: 'Token expired, please log in again!' });
      }
      return res.json({ message: 'Token is invalid!' });
    }
  };

  const verifyProvider = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Expecting 'Bearer <token>'
    if (!token) {
        return res.status(403).json({ message: 'No token provided!' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.providerId = decoded.providerId; // Attach providerId to req
        next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.json({ message: 'Token expired, please log in again!' });
      }
      res.json({ message: 'Token is invalid!' });
    }
};
  
  const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
  };

  export{verifyToken,verifyProvider,isAdmin}
