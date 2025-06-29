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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../../generated/prisma");
const jwt_1 = require("../middlewares/jwt");
const router = (0, express_1.Router)();
const prisma = new prisma_1.PrismaClient();
// Get all portfolios for the current user
// @ts-ignore
router.get("/", jwt_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: "Authentication required" });
        }
        const portfolios = yield prisma.portfolio.findMany({
            where: { userId },
        });
        return res.status(200).json({ portfolios });
    }
    catch (error) {
        console.error("Error fetching portfolios:", error);
        return res
            .status(500)
            .json({ message: "Server error fetching portfolios" });
    }
}));
// Create a new portfolio
// @ts-ignore
router.post("/", jwt_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        if (!userId) {
            return res.status(401).json({ message: "Authentication required" });
        }
        const { title, fullName, description, jobTitle, bio, skills, email, phone, location, githubUrl, linkedinUrl, twitterUrl, personalUrl, education, workExp, projects, profileUrl, theme, } = req.body;
        // Validate required fields
        if (!title || !fullName || !skills) {
            return res.status(400).json({
                message: "Title, full name, and skills are required",
            });
        }
        // Create portfolio with only valid fields from schema
        const portfolioData = {
            title,
            fullName,
            skills, // Required field
            userId, // Required field for relation
            description: description || null,
            jobTitle: jobTitle || null,
            bio: bio || null,
            email: email || null,
            phone: phone || null,
            location: location || null,
            githubUrl: githubUrl || null,
            linkedinUrl: linkedinUrl || null,
            twitterUrl: twitterUrl || null,
            personalUrl: personalUrl || null,
            education: education || null,
            workExp: workExp || null,
            projects: projects || null,
            profileUrl: profileUrl || null,
            theme: theme || "MINIMAL",
        };
        const portfolio = yield prisma.portfolio.create({
            data: portfolioData,
        });
        return res.status(201).json({
            message: "Portfolio created successfully",
            portfolio,
        });
    }
    catch (error) {
        console.error("Error creating portfolio:", error);
        return res.status(500).json({ message: "Server error creating portfolio" });
    }
}));
// Get a single portfolio by ID (public)
// @ts-ignore
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const portfolio = yield prisma.portfolio.findUnique({
            where: { id, isActive: true },
        });
        if (!portfolio) {
            return res.status(404).json({ message: "Portfolio not found" });
        }
        return res.status(200).json({ portfolio });
    }
    catch (error) {
        console.error("Error fetching portfolio:", error);
        return res.status(500).json({ message: "Server error fetching portfolio" });
    }
}));
// Update a portfolio
// @ts-ignore
router.put("/:id", jwt_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const { id } = req.params;
        const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.id;
        console.log("id: ", id);
        console.log("userId: ", userId);
        if (!userId) {
            return res.status(401).json({ message: "Authentication required" });
        }
        // Check if portfolio exists and belongs to user
        const existingPortfolio = yield prisma.portfolio.findFirst({
            where: {
                id,
                userId,
            },
        });
        console.log("Exisiting portfolio: ", existingPortfolio);
        if (!existingPortfolio) {
            return res.status(404).json({
                message: "Portfolio not found or you don't have permission to update it",
            });
        }
        // Extract only valid fields from the request body
        const { title, fullName, description, jobTitle, bio, skills, email, phone, location, githubUrl, linkedinUrl, twitterUrl, personalUrl, education, workExp, projects, profileUrl, theme, isActive, } = req.body;
        // Update portfolio with only valid fields
        const updatedPortfolio = yield prisma.portfolio.update({
            where: { id },
            data: {
                title,
                fullName,
                description,
                jobTitle,
                bio,
                skills,
                email,
                phone,
                location,
                githubUrl,
                linkedinUrl,
                twitterUrl,
                personalUrl,
                education,
                workExp,
                projects,
                profileUrl,
                theme,
                isActive,
            },
        });
        console.log("Updated Portfolio: ", updatedPortfolio);
        return res.status(200).json({
            message: "Portfolio updated successfully",
            portfolio: updatedPortfolio,
        });
    }
    catch (error) {
        console.error("Error updating portfolio:", error);
        return res.status(500).json({ message: "Server error updating portfolio" });
    }
}));
// Delete a portfolio
// @ts-ignore
router.delete("/:id", jwt_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const { id } = req.params;
        const userId = (_d = req.user) === null || _d === void 0 ? void 0 : _d.id;
        if (!userId) {
            return res.status(401).json({ message: "Authentication required" });
        }
        // Check if portfolio exists and belongs to user
        const existingPortfolio = yield prisma.portfolio.findFirst({
            where: {
                id,
                userId,
            },
        });
        if (!existingPortfolio) {
            return res.status(404).json({
                message: "Portfolio not found or you don't have permission to delete it",
            });
        }
        // Delete portfolio
        yield prisma.portfolio.delete({
            where: { id },
        });
        return res.status(200).json({ message: "Portfolio deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting portfolio:", error);
        return res.status(500).json({ message: "Server error deleting portfolio" });
    }
}));
// Toggle portfolio active status
router.patch("/:id/toggle-status", 
// @ts-ignore
jwt_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const { id } = req.params;
        const userId = (_e = req.user) === null || _e === void 0 ? void 0 : _e.id;
        if (!userId) {
            return res.status(401).json({ message: "Authentication required" });
        }
        // Check if portfolio exists and belongs to user
        const existingPortfolio = yield prisma.portfolio.findFirst({
            where: {
                id,
                userId,
            },
        });
        if (!existingPortfolio) {
            return res.status(404).json({
                message: "Portfolio not found or you don't have permission to update it",
            });
        }
        // Toggle isActive status
        const updatedPortfolio = yield prisma.portfolio.update({
            where: { id },
            data: {
                isActive: !existingPortfolio.isActive,
            },
        });
        return res.status(200).json({
            message: `Portfolio ${updatedPortfolio.isActive ? "activated" : "deactivated"} successfully`,
            portfolio: updatedPortfolio,
        });
    }
    catch (error) {
        console.error("Error toggling portfolio status:", error);
        return res
            .status(500)
            .json({ message: "Server error updating portfolio status" });
    }
}));
// Get a portfolio by username (public route)
// @ts-ignore
router.get("/public/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.params;
        // Find the user first
        const user = yield prisma.user.findUnique({
            where: { username }
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const { portfolioId } = req.query;
        const portfolio = yield prisma.portfolio.findFirst({
            where: Object.assign({ userId: user.id, isActive: true }, (portfolioId ? { id: portfolioId } : {}))
        });
        if (!portfolio) {
            return res.status(404).json({ message: "No active portfolio found for this user" });
        }
        return res.status(200).json({ portfolio });
    }
    catch (error) {
        console.error("Error fetching public portfolio:", error);
        return res.status(500).json({ message: "Server error fetching portfolio" });
    }
}));
exports.default = router;
