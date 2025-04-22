import UserList from "../models/users.models.js";
import PromptList from "../models/prompts.models.js";
import { generateToken } from "../utils/jwt.js";
import bcrypt from 'bcryptjs';

export const addUser = async (req, res) => {
    const user = req.body;

    if (
        typeof user.userId !== 'string' || 
        typeof user.userName !== 'string' ||
        typeof user.email !== 'string' ||
        typeof user.Password !== 'string'
    ) {
        return res.status(400).json({ 
            success: false, 
            message: "Please provide valid fields to create a user" 
        });
    }

    try {
        // Check if email already exists
        const existingUser = await UserList.findOne({ email: user.email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: "Email is already registered" 
            });
        }

        const hashedPassword = await bcrypt.hash(user.Password, 10);
        const newUser = new UserList({ ...user, Password: hashedPassword });
        await newUser.save();
        const token = generateToken({ id: newUser.userId });
        res.status(200).json({ 
            success: true, 
            message: `User created successfully`, 
            token, 
            user: {
                userId: newUser.userId,
                userName: newUser.userName,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error("Error in creating user:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
};

export const loginUser = async (req, res) => {
    const { email, Password } = req.body;

    try {
        const userLogin = await UserList.findOne({ email });
        if (!userLogin) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(Password, userLogin.Password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = generateToken({ id: userLogin.userId });

        return res.status(200).json({
            success: true,
            message: "User authenticated",
            token,
            user: {
                userId: userLogin.userId,
                email: userLogin.email,
                userName: userLogin.userName,
            }
        });

    } catch (error) {
        console.error("Error in login:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const deleteUser = async (req, res) => {
    const userId = req.user.id;

    try {
        const userLogin = await UserList.findOne({ userId });
        if (!userLogin) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        await UserList.deleteOne({ userId });
        await PromptList.deleteMany({ userId });

        return res.status(200).json({
            success: true,
            message: `User and their associated tasks have been deleted successfully`
        });

    } catch (error) {
        console.error("Error in deleting user account:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};