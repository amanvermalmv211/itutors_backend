import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const fetchIsAdmin = async (req, res, next)=>{
    try {
        if(req.user.type === "admin"){
            next();
            return;
        }
        else{
            return res.status(500).json({ success: false, message: "Not Allowed: Admin Only" })
        }
    } catch (error) {
        res.status(401).json({success: false, message: "Server Error: Try again later!"});
    }

}

const fetchuser = (req, res, next)=>{
    const token = req.header('itsauthtoken');
    if(!token){
        return res.status(401).json({success: false, message: "Please authenticate using a valid token"});
    }
    
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        return res.status(401).json({success: false, message: "Please authenticate using a valid token"});
    }

}

export default fetchuser;