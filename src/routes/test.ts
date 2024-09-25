import { Router } from "express";
import {
  getLargeContent,
  getThirdPartyContent,
} from "../controllers/testController";

const router: Router = Router();

router.get("/third-party-content", getThirdPartyContent);
router.get("/large-content", getLargeContent);

export default router;
