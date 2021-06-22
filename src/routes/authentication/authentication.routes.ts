import { Router } from "express";
const router = Router();
import { auth } from "../../controllers/controllers";

router.post("/loginadm", auth.loginADM);
router.post("/login", auth.login);
router.get("/refresh", auth.refreshADM);

export default router;
