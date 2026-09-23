import type { Request, Response } from "express";

import User from "../models/User.model.js";

export const authCheck = async (
    req: Request,
    res: Response
) => {
    try {
        const email = req.query.email;

        if (!email || typeof email !== "string") {
            return res.status(400).json({
                message: "Email is required",
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase().trim(),
        }).select("-password");

        if (!user) {
            return res.status(401).json({
                authenticated: false,
                message: "User does not exist",
            });
        }

        return res.status(200).json({
            authenticated: true,
            user,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong",
            error,
        });
    }
};


// REGISTER
export const register = async (
    req: Request,
    res: Response
) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Username, email and password are required",
            });
        }

        const normalizedUsername = username.toLowerCase().trim();
        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({
            $or: [
                { username: normalizedUsername },
                { email: normalizedEmail },
            ],
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Username or email already exists",
            });
        }

        const user = await User.create({
            username: normalizedUsername,
            email: normalizedEmail,
            password,
            isLogin: true,
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                isLogin: user.isLogin,
            },
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong",
            error,
        });
    }
};


// LOGIN
export const login = async (
    req: Request,
    res: Response
) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required",
            });
        }

        const identifier = (username).toLowerCase().trim();

        const user = await User.findOne({
            username: identifier
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid username or password",
            });
        }

        if (user.password !== password) {
            return res.status(401).json({
                message: "Invalid username or password",
            });
        }

        user.isLogin = true;
        await user.save();

        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                isLogin: user.isLogin,
            },
        });

    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error,
        });
    }
};


// LOGOUT
export const logout = async (
    req: Request,
    res: Response
) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "User Email is required",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        user.isLogin = false;
        await user.save();

        return res.status(200).json({
            message: "Logout successful",
        });

    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error,
        });
    }
};