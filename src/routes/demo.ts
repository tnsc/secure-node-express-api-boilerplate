import { Router } from "express";
import { getDataWithCaching } from "../controllers/demoController";
import { checkCache } from "../middleware/caching";

const router: Router = Router();

router.get("/", checkCache, getDataWithCaching);

export default router;
