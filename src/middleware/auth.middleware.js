import jwt from "jsonwebtoken"
import User from "../models/User.js"

const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({ message: "No authentication token, access denied" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No authentication token, access denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // 🔍 Debugging line

    const userId = decoded.userId || decoded.id || decoded._id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found, token invalid" });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error("Authentication error!", error.message);
    res.status(401).json({ message: "Token is not valid" });
  }
}

export default protectRoute;
