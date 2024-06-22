const jwt = require("jsonwebtoken");
const userSchema = require("../schemas/userSchema")
const guardianSchema = require("../schemas/guardianSchema")
const healthcareProfessionalSchema = require("../schemas/healthcareProfessional") 

const key = "yourSecretKey"; // secret key

const generateToken = (userID,userType) => {
  const token = jwt.sign(
    {
      userID: userID,
      userType: userType
    },
    key,
    { expiresIn: '1h' } // Sets the token to expire in one hour
  );
  return token;
};

// const authMiddleware = (req, res, next) => {
//   const token = req.headers.authorization || "";
//   if (!token) {
//     return res.status(500).send("Authorization token not provided.");
//   }
//   jwt.verify(token, key, (err, data) => {
//     if (err) {
//       return res.status(401).send("Invalid authorization token.");
//     } else {
//       res.user = {
//         userID: data.userID,
//       };
//       next();
//     }
//   });
// };

// Authentication middleware to verify token and attach user to the request
const authMiddleware = async (req, res, next) => {
  try {
    // Check if cookies are present in the request
    if (!req.cookies) {
      return res.status(401).json({ message: 'No Cookie' });
    }

    // Check if jwt cookie is present
    if (!req.cookies.jwt) {
      return res.status(401).json({ message: 'No jwt token in Cookie' });
    }

    const token = req.cookies.jwt;
    console.log(token);
    if (!token) {
      return res.status(401).json({ message: 'You are not logged in' });
    }

    const decodedToken = jwt.verify(token, key);
    const { userID, userType } = decodedToken;

    // Find the user based on userType and attach to request object
    switch (userType) {
      case 'User':
        req.user = await userSchema.findById(userID);
        break;
      case 'Guardian':
        req.user = await guardianSchema.findById(userID);
        break;
      case 'Healthcare Professional':
        req.user = await healthcareProfessionalSchema.findById(userID);
        break;
      default:
        return res.status(400).json({ message: 'Invalid user type' });
    }

    if (!req.user) {
      return res.status(404).json({ message: 'User not found' });
    }

    next();
  } catch (err) {
    return res.status(400).json({ message: 'Invalid token: ' + err.message });
  }
};

module.exports = { generateToken, authMiddleware };
