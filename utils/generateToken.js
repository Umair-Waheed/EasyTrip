import jwt from "jsonwebtoken";

const generateToken = (payload, secret, expiresIn = '1h') => {
  // console.log(payload,secret);
    try {
      const token = jwt.sign(payload, secret, { expiresIn });
      // console.log(token)
      return token;
    } catch (error) {
      console.error('Error generating token:', error);
      throw error;
    }
  };

// const verifyToken = (req, res, next) => {
//   const token = req.headers['authorization']?.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ message: 'Access denied. No token provided.' });
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(403).json({ message: 'Invalid token' });
//   }
// };

// const isAdmin = (req, res, next) => {
//   if (req.user.role !== 'admin') {
//     return res.status(403).json({ message: 'Access denied. Admins only.' });
//   }
//   next();
// };

export { generateToken}