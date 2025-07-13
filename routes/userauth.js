import dotenv from 'dotenv';
import express from 'express';
import User from '../model/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;


// Route 1 : Create user using : POST "/userauth/createuser"
// router.post('/createuser', async (req, res) => {
//     let success = false;

//     try {
//         const { email, password, type } = req.body;

//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ success, message: "Sorry, a user with this email already exists." });
//         }

//         const salt = await bcrypt.genSalt(10);
//         const secPass = await bcrypt.hash(password, salt);

//         await User.create({
//             email: email,
//             password: secPass,
//             type: type
//         });

//         return res.status(200).json({ success: true, message: "Account has been created!" });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).send("Internal server error occurred.");
//     }
// });


// Route 2 : Authanticate an User using : POST "/user/userauth/loginuser".
router.post('/loginuser', async (req, res) => {
    let success = false;

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success, message: "User doesn't exists" });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ success, message: "Password do not match!" });
        }

        const data = {
            user: {
                id: user.id,
                type: user.type,
                isverified: user.isverified
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authtoken, type: user.type, message: "User loged in successfully" });

    } catch (err) {
        res.status(500).send(err.message);
    }

});

export default router;