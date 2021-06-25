import { Router } from "express";
import { controCard, controPhotos } from "../../controllers/controllers";
import { middRol, middMulter } from "../../middlewares/middlewares";
const router = Router();

router.get("/cards", middRol.isALLUSER, controCard.GETCARDS);
router.get("/cards/:id", middRol.isALLUSER, controCard.GETCARD);
router.get("/search", middRol.isALLUSER, controCard.SEARCHCARD);
router.post(
  "/card",
  middRol.isADM,
  middMulter.default.uploadCard.single("card"),
  controCard.ADDCARD
);
router.post("/deletecard", middRol.isADM, controCard.DELETECARD);
router.patch(
  "/card",
  middRol.isADM,
  controCard.EDITCARD
);
router.patch(
  "/editphotocard/:id",
  middRol.isADM,
  middMulter.default.upload.single("card"),
  controPhotos.ADDPhotoCARD
);
router.post("/validatortype", middRol.isADM, controCard.VALIDTITLEADD);
router.post(
  "/validatorsttype/:id",
  middRol.isADM,
  controCard.VALIDTILTEEDIT
);
export default router;
