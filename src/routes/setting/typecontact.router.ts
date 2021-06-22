import { Router } from "express";
import { controTypeContact } from "../../controllers/controllers";
import { modelsTypeContact } from "../../models/models";
import { middTypeContact } from "../../middlewares/middlewares";

const CRUD = require("easy-express-crud-generator");
const router = Router();
const typecontactRouter = new CRUD(modelsTypeContact).getRouter(Router());

router.get("/typecontact", middTypeContact.GETYPECONTACTS);
router.put("/typecontact/:id", middTypeContact.EDITTYPECONTACT);
router.delete("/typecontact/:id", middTypeContact.DELETETYPECONTACT);
router.post("/typecontact", middTypeContact.ADDTYPECONTACT);
router.use("/typecontact", typecontactRouter);
router.post(
  "/validaddtypecontact",
  middTypeContact.VALIDTYPECONTACT,
  controTypeContact.VALIDNAMEADD
);
router.post(
  "/validaddtypecontact/:id",
  middTypeContact.VALIDTYPECONTACT,
  controTypeContact.VALIDNAMEEDIT
);
router.post(
  "/deletetypecontacts",
  middTypeContact.DELETETYPECONTACTS,
  controTypeContact.DELETETYPECONTACTS
);

export default router;
