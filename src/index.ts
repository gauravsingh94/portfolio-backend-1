import express, { Request, Response } from "express";
import userRoutes from "./routes/user";
import portfolioRoutes from "./routes/portfolio";
import cors from "cors";
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Portfolio Pro API!");
});

// Register routes
app.use('/api/users', userRoutes);
app.use('/api/portfolios', portfolioRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
