"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = 3000;
// Middleware
app.use(express_1.default.json());
// Routes
app.get("/", (req, res) => {
    res.send("Welcome to the TypeScript API!");
});
app.get("/hello", (req, res) => {
    res.json({ message: "Hello from TypeScript" });
});
app.post("/echo", (req, res) => {
    res.json({ received: req.body });
});
app.put("/update", (req, res) => {
    res.json({ updated: req.body });
});
app.delete("/delete/:id", (req, res) => {
    res.json({ deletedId: req.params.id });
});
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
