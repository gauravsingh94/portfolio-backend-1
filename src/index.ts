import express, { Request, Response } from "express";

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the TypeScript API!");
});

app.get("/hello", (req: Request, res: Response) => {
  res.json({ message: "Hello from TypeScript" });
});

app.post("/echo", (req: Request, res: Response) => {
  res.json({ received: req.body });
});

app.put("/update", (req: Request, res: Response) => {
  res.json({ updated: req.body });
});

app.delete("/delete/:id", (req: Request, res: Response) => {
  res.json({ deletedId: req.params.id });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
