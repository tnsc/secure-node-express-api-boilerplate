import { getAllUsers, getUserById } from "../controllers/userController";
import { Request, Response } from "express";

describe("User Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockJson: jest.Mock;

  beforeEach(() => {
    mockReq = {};
    mockJson = jest.fn();
    mockRes = {
      json: mockJson,
      status: jest.fn(() => mockRes) as any,
    };
  });

  it("should return all users", () => {
    getAllUsers(mockReq as Request, mockRes as Response);

    expect(mockJson).toHaveBeenCalledWith([
      { id: 1, name: "This test will fail" },
      { id: 2, name: "Bob" },
    ]);
  });

  it("should return a user by ID", () => {
    mockReq = { params: { id: "1" } };

    getUserById(mockReq as Request, mockRes as Response);

    expect(mockJson).toHaveBeenCalledWith({ id: 1, name: "Alice" });
  });

  it("should return 404 if user is not found", () => {
    mockReq = { params: { id: "99" } };

    getUserById(mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockJson).toHaveBeenCalledWith({ message: "User not found" });
  });
});
