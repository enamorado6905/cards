import { Router } from "express";
import { controUser } from "../../controllers/controllers";
import { middRol } from "../../middlewares/middlewares";
const router = Router();

router.get("/users", middRol.isADM, controUser.GETUSERS);
router.get("/users/:id", middRol.isALLUSER, controUser.GETUSER);
router.get("/search", middRol.isADM, controUser.SEARCHUSER);
router.post("/deleteuser", middRol.isADM, controUser.DELETEUSER);
router.post("/user", middRol.isALLUSER, controUser.ADDUSER);
router.post("/validatoruser", middRol.isALLUSER, controUser.VALIDUSERADD);
router.post("/validatoruser/:id", middRol.isALLUSER, controUser.VALIDUSEREDIT);
router.post("/validatoremail", middRol.isALLUSER, controUser.VALIDEMAILADD);
router.post(
  "/validatoremail/:id",
  middRol.isALLUSER,
  controUser.VALIDEMAILEDIT
);
router.patch("/user", middRol.isALLUSER, controUser.EDITUSER);
router.patch("/editrol", middRol.isADM, controUser.EDITROLUSER);
router.patch("/editpassword", middRol.isALLUSER, controUser.EDITPASSWORDUSER);
export default router;
