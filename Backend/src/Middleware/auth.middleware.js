import jwt from "jsonwebtoken";
import User from "../Models/User.js";

export const protectRoute = async (req, res, next) => {
     try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - N0 Token provided" });
        } 
        
        const decode = jwt.verify(token , process.env.JWT_SECRET);
        if( !decode ){
            return res.status(401).json({ message: "Unauthorized Invalid Token" });
        }
    
        const user = await User.findById(decode.userId).select("-password"); // Exclude password from the user object
        if (!user) {  
            return res.status(401).json({ message: "Unauthorized - User not found" });
        }
        req.user = user; // Attach user to request object
        next(); // Proceed to the next middleware or route handler
     } catch (error) {
        console.error("Error in auth middleware:", error);
        res.status(500).json({ message: "Internal server error" });
     }
}