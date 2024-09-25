import { Request, Response } from "express";
import axios from "axios";

export const getThirdPartyContent = async (req: Request, res: Response) => {
  try {
    const response = await axios.get("https://example.com"); // Replace with your desired URL
    res.setHeader("Content-Type", "text/html");
    res.send(response.data); // Serve the actual response content
  } catch (error) {
    console.error("Error fetching third-party content:", error);
    res.status(500).send("Error fetching third-party content");
  }
};

/**
 * Test route to demonstrate compression functionality.
 */
export const getLargeContent = (_req: Request, res: Response) => {
  /**
   * Set the Content-Type header for HTML responses.
   */
  res.setHeader("Content-Type", "text/html");

  /**
   * Send a large HTML response to demonstrate compression.
   */
  res.send(
    "<html><body>" +
      "Hello, this response is compressed! ".repeat(1000) +
      "</body></html>"
  );
};
