import { Router } from "express";
import { controRental } from "../../controllers/controllers";
import { middRol } from "../../middlewares/middlewares";
const router = Router();

router.get("/rentals", middRol.isALLUSER, controRental.GETRENTALS);
router.get("/rental/:id", middRol.isALLUSER, controRental.ADDRENTAL);
router.get("/search", middRol.isALLUSER, controRental.SEARCHRENTALS);
router.post("/rental", middRol.isALLUSER, controRental.ADDRENTAL);
router.delete("/rental", middRol.isALLUSER, controRental.DELETERENTAL);
router.patch("/rental", middRol.isALLUSER, controRental.EDITRENTAL);
router.post("/deleterental", middRol.isALLUSER, controRental.DELETERENTALS);
export default router;
