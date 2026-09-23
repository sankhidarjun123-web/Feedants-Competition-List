import express from "express";
import { authCheck, register, login, logout } from "../controllers/auth.controller.js";



const router = express.Router();

router.get("/auth-check", authCheck);

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);


export default router;