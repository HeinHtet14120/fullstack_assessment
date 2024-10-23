import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const jwtSecretKey = process.env.JWT_SECRET_KEY;

export const verifyToken = (requiredRole) => {

    return (req, res, next) => {
        const token = req.cookies.token;
        
        if (!token) return res.status(401).json({ message: "Not Authenticated" });

        try {
            const user = jwt.verify(token, jwtSecretKey);

            if (user.isAdmin !== requiredRole) {
                return res.status(403).json({ message: "You do not have permissions." });
            }

            req.user = user;
            next();
        }

        catch (err) {
            console.error(err);
            res.status(400).json({ message: "Invalid token." });
        }
    }

};

export const getUserIdFromToken = (req, res, next) => {
    
        const token = req.cookies.token;

        console.log("this is token : ", token)
        
        if (!token) return res.status(401).json({ message: "Not Authenticated" });

        try {
            const user = jwt.verify(token, jwtSecretKey);
            console.log("this is user : ", user)

            req.user = user.id; 
            next();
        }

        catch (err) {
            console.error(err);
            res.status(400).json({ message: "Invalid token." });
        }
};