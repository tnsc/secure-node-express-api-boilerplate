/**
 * Import necessary types from Express for request and response handling.
 */
import { Request, Response } from "express";

/**
 * Mock data array representing users.
 * In a real application, this would typically be fetched from a database.
 * @type {{id: number; name: string}[]}
 */
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

/**
 * Controller function to retrieve all users.
 *
 * This function returns the entire mock user dataset as JSON.
 *
 * @param {Request} req - Express request object (not used in this function)
 * @param {Response} res - Express response object
 * @returns {void} Sends JSON response
 */
export const getAllUsers = (req: Request, res: Response) => {
  /**
   * Send the mock user array as JSON response.
   */
  res.json(users);
};

/**
 * Controller function to retrieve a single user by ID.
 *
 * This function searches for a user matching the provided ID and returns the user object if found.
 * If no user is found, it sends a 404 status with an error message.
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {void} Sends JSON response or error
 */
export const getUserById = (req: Request, res: Response) => {
  /**
   * Find the user in the mock dataset whose ID matches the requested ID.
   * @type {{id: number; name: string}|undefined}
   */
  const user = users.find((u) => u.id === parseInt(req.params.id));

  if (!user) {
    /**
     * If no user is found, send a 404 status with an error message.
     */
    return res.status(404).json({ message: "User not found" });
  }

  /**
   * If a user is found, send the user object as JSON response.
   */
  res.json(user);
};
