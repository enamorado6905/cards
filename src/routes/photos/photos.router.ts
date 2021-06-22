import { controPhotos } from "../../controllers/controllers";
import { Router } from "express";
const router = Router();

router.get("/:id", controPhotos.GETPhoto);
export default router;
