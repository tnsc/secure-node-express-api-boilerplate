import { Router } from "express";
import { getAllUsers, getUserById } from "../controllers/userController";

const router: Router = Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);

export default router;
