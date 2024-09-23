import { Request, Response } from "express";

// Mock data for users
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

// Get all users
export const getAllUsers = (req: Request, res: Response) => {
  res.json(users);
};

// Get user by ID
export const getUserById = (req: Request, res: Response) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
};
