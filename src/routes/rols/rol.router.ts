import { Router } from "express";
import { controRol } from "../../controllers/controllers";
import { middRol } from "../../middlewares/middlewares";
const router = Router();

router.get("/rols", middRol.isADM, controRol.GETROLS);
router.get("/rols/:id", middRol.isADM, controRol.GETROL);
router.get("/search", middRol.isADM, controRol.SEARCHROLS);
router.post("/rol", middRol.isADM, controRol.ADDROL);
router.patch("/rol", middRol.isADM, controRol.EDITROL);
router.delete("/rol", middRol.isADM, controRol.DELETEROL);
router.post("/validaddrol", middRol.isADM, controRol.VALIDNAMEADD);
router.post("/validaddrol/:id", middRol.isADM, controRol.VALIDNAMEEDIT);

export default router;
