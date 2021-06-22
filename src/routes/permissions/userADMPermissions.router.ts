import { Router } from "express";
import { userADMPermissions } from "../../controllers/controllers";
import { middPermissions } from "../../middlewares/middlewares";

const router = Router();

router.get(
  "/permissions",
  middPermissions.GETPERMISSIONSADM,
  userADMPermissions.GETPERMISSIONS
);
router.get(
  "/permission/:id",
  middPermissions.GETPERMISSIONADM,
  userADMPermissions.GETPERMISSION
);
router.post(
  "/permission",
  middPermissions.ADDPERMISSIONADM,
  userADMPermissions.ADDPERMISSION
);
router.put(
  "/permission",
  middPermissions.EDITPERMISSIONADM,
  userADMPermissions.EDITPERMISSION
);
router.delete(
  "/permission",
  middPermissions.DELETEPERMISSIONADM,
  userADMPermissions.DELETEPERMISSION
);
router.post(
  "/validaddpermission",
  middPermissions.VALIDPERMISSIONADM,
  userADMPermissions.VALIDNAMEADD
);
router.post(
  "/validaddpermission/:id",
  middPermissions.VALIDPERMISSIONADM,
  userADMPermissions.VALIDNAMEEDIT
);
router.post(
  "/deletepermissions",
  middPermissions.DELETEPERMISSIONSADM,
  userADMPermissions.DELETEPERMISSIONS
);

export default router;
