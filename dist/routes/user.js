"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../../generated/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../middlewares/jwt");
const router = (0, express_1.Router)();
const prisma = new prisma_1.PrismaClient();
// Validate email format
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
// User signup route
// @ts-ignore
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, username, email, password } = req.body;
        // Validate required fields
        if (!fullName || !username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        // Validate email format
        if (!isValidEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        // Check if username already exists
        const existingUsername = yield prisma.user.findUnique({
            where: { username }
        });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already taken' });
        }
        // Check if email already exists
        const existingEmail = yield prisma.user.findUnique({
            where: { email }
        });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already registered' });
        }
        // Hash password
        const saltRounds = 10;
        const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
        // Create new user
        const user = yield prisma.user.create({
            data: {
                fullName,
                username,
                email,
                password: hashedPassword
            }
        });
        // Create token
        const token = (0, jwt_1.generateToken)({
            id: user.id,
            username: user.username,
            email: user.email
        });
        // Return user data (excluding password)
        const { password: _ } = user, userData = __rest(user, ["password"]);
        return res.status(201).json({
            message: 'User registered successfully',
            user: userData,
            token
        });
    }
    catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({ message: 'Server error during registration' });
    }
}));
// User login route
// @ts-ignore
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        // Find user by email
        const user = yield prisma.user.findUnique({
            where: { email }
        });
        // Check if user exists
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Verify password
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Create token
        const token = (0, jwt_1.generateToken)({
            id: user.id,
            username: user.username,
            email: user.email
        });
        // Return user data (excluding password)
        const { password: _ } = user, userData = __rest(user, ["password"]);
        return res.status(200).json({
            message: 'Login successful',
            user: userData,
            token
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Server error during login' });
    }
}));
// Get user profile route (protected)
// @ts-ignore
router.get('/profile', jwt_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // User is available from the middleware
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        // Find user by ID
        const user = yield prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Return user data (excluding password)
        const { password: _ } = user, userData = __rest(user, ["password"]);
        return res.status(200).json({
            user: userData
        });
    }
    catch (error) {
        console.error('Profile fetch error:', error);
        return res.status(500).json({ message: 'Server error retrieving profile' });
    }
}));
exports.default = router;
