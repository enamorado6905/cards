import { Router } from "express";
import { controContact } from "../../controllers/controllers";
import { modelsContact } from "../../models/models";
import { middContact } from "../../middlewares/middlewares";

const CRUD = require("easy-express-crud-generator");
const router = Router();
const contactRouter = new CRUD(modelsContact).getRouter(Router());

router.get("/contact", middContact.GETCONTACTS);
router.put("/contact", middContact.EDITCONTACT);
router.delete("/contact", middContact.DELETECONTACT);
router.use("/contact", contactRouter);
router.post(
  "/validaddcontact",
  middContact.VALIDCONTACT,
  controContact.VALIDNAMEADD
);
router.post(
  "/validaddcontact/:id",
  middContact.VALIDCONTACT,
  controContact.VALIDNAMEEDIT
);
router.post(
  "/deletecontacts",
  middContact.DELETECONTACTS,
  controContact.DELETECONTACTS
);

export default router;
