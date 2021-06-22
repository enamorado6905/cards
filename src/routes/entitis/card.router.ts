import { Router } from "express";
import { controCard, controPhotos } from "../../controllers/controllers";
import { middRol, middMulter } from "../../middlewares/middlewares";
const router = Router();

router.get("/cards", middRol.isALLUSER, controCard.GETCARDS);
router.get("/card/:id", middRol.isALLUSER, controCard.ADDCARD);
router.get("/search", middRol.isALLUSER, controCard.SEARCHCARD);
router.post(
  "/card",
  middRol.isALLUSER,
  middMulter.default.uploadCard.single("card"),
  controCard.ADDCARD
);
router.delete("/card", middRol.isALLUSER, controCard.DELETECARD);
router.patch("/card", middRol.isALLUSER, controCard.EDITCARD);
router.patch(
  "/addphoto",
  middRol.isADM,
  middMulter.default.upload.single("card"),
  controPhotos.ADDPhotoCARD
);
router.post("/validatortype", middRol.isALLUSER, controCard.VALIDTITLEADD);
router.post(
  "/validatorsttype/:id",
  middRol.isALLUSER,
  controCard.VALIDTILTEEDIT
);
export default router;
