import { Request, Response, NextFunction } from "express";
import { libValid } from "../../lib/lib";

export async function isADM(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    return libValid.checkPermission(req.body.ROL, "ADM")
      ? next()
      : res.status(403).json("ROL NOT ANUTHORIZE");
  } catch (error) {
    return res.status(500).json("ROL NOT ANUTHORIZE");
  }
}
export async function isUSER(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    return libValid.checkPermission(req.body.ROL, "USER")
      ? next()
      : res.status(403).json("ROL NOT ANUTHORIZE");
  } catch (error) {
    return res.status(500).json("ROL NOT ANUTHORIZE");
  }
}
export async function isALLUSER(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    return libValid.checkallPermission(req.body.ROL)
      ? next()
      : res.status(403).json("ROL NOT ANUTHORIZE");
  } catch (error) {
    return res.status(500).json("ROL NOT ANUTHORIZE");
  }
}
