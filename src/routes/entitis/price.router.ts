import { Router } from "express";
import { controPrice } from "../../controllers/controllers";
import { middRol } from "../../middlewares/middlewares";
const router = Router();

router.get("/prices", middRol.isALLUSER, controPrice.GETPRICES);
router.get("/price/:id", middRol.isALLUSER, controPrice.ADDPRICE);
router.get("/search", middRol.isALLUSER, controPrice.SEARCHPRICES);
router.post("/price", middRol.isALLUSER, controPrice.ADDPRICE);
router.delete("/price", middRol.isALLUSER, controPrice.DELETEPRICE);
router.put("/price", middRol.isALLUSER, controPrice.EDITPRICE);
export default router;
