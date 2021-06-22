import { Router } from "express";
import { controSession } from "../../controllers/controllers";
import { modelsSession } from "../../models/models";
import { middSession } from "../../middlewares/middlewares";

const CRUD = require("easy-express-crud-generator");
const router = Router();
const sessionRouter = new CRUD(modelsSession).getRouter(Router());

router.get("/session", middSession.GETSESSIONS);
router.put("/session/:id", middSession.EDITSESSION);
router.delete("/session/:id", middSession.DELETESESSION);
router.post("/session", middSession.ADDSESSION);
router.use("/session", sessionRouter);
router.post(
  "/validaddsession",
  middSession.VALIDSESSION,
  controSession.VALIDNAMEADD
);
router.post(
  "/validaddsession/:id",
  middSession.VALIDSESSION,
  controSession.VALIDNAMEEDIT
);
router.post(
  "/deletesessions",
  middSession.DELETESESSIONS,
  controSession.DELETESESSIONS
);

export default router;
