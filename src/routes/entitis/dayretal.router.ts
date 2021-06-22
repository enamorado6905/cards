import { Router } from "express";
import { controDayRental } from "../../controllers/controllers";
import { middRol } from "../../middlewares/middlewares";
const router = Router();

router.get("/dayrentals", middRol.isALLUSER, controDayRental.GETDAYRENTALS);
router.get("/dayrentals/:id", middRol.isALLUSER, controDayRental.GETDAYRENTAL);
router.get("/search", middRol.isADM, controDayRental.SEARCHDAYRENTAL);
router.post("/dayrental", middRol.isADM, controDayRental.ADDDAYRENTAL);
router.delete("/dayrental", middRol.isADM, controDayRental.DELETEDAYRENTAL);
router.put("/dayrental", middRol.isADM, controDayRental.EDITDAYRENTAL);
export default router;
