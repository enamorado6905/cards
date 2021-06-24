import { Router } from "express";
import { controUserADM, controPhotos } from "../../controllers/controllers";
import { middRol, middMulter } from "../../middlewares/middlewares";
const router = Router();

router.get("/users", middRol.isADM, controUserADM.GETUSERADMS);
router.get("/users/:id", middRol.isADM, controUserADM.GETUSERADM);
router.get("/search", middRol.isADM, controUserADM.SEARCHUSERADM);
router.post("/user", middRol.isADM, controUserADM.ADDUSERADM);
router.post("/deleteuser", middRol.isADM, controUserADM.DELETEUSERADM);
router.patch("/user", middRol.isADM, controUserADM.EDITUSERADM);
router.patch(
  "/addphoto",
  middRol.isADM,
  middMulter.default.upload.single("photoadm"),
  controPhotos.ADDPhotoADM
);
router.post("/validatorsuser", middRol.isADM, controUserADM.VALIDUSERADD);
router.post("/validatorsuser/:id", middRol.isADM, controUserADM.VALIDUSEREDIT);
router.post("/validatorsemail", middRol.isADM, controUserADM.VALIDEMAILADD);
router.post(
  "/validatorsemail/:id",
  middRol.isADM,
  controUserADM.VALIDEMAILEDIT
);

router.patch("/editpassword", middRol.isADM, controUserADM.EDITPASSWORD);
router.patch("/editrol", middRol.isADM, controUserADM.EDITROLUSERADM);

export default router;
