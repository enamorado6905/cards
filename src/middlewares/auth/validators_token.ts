import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { modelsRol, modelsUserADM, IUserADM } from "../../models/models";

export async function token_validators_ADM(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const token: any = req.headers.authtoken;
    if (!token) {
      return res.status(403).json("ANUTHORIZE REQUEST");
    }
    const data: any = jwt.verify(
      token.toString(),
      process.env.TOKEN_SECRET || "TOKEN_TXT"
    );
    let user = await modelsUserADM.findById(data._id, {
      rol: 1,
      active: 1,
    });
    if (!user || !user.active) {
      return res.status(401).json("ANUTHORIZE REQUEST");
    }
    await modelsRol.populate(user, {
      path: "rol",
      justOne: true,
      select: ["name"],
    });
    if (!user.rol) {
      return res.status(403).json("ANUTHORIZE REQUEST");
    }
    req.body.ROL = user.rol;
    return next();
  } catch (error) {
    return res
      .status(403)
      .json({ type: `${error.type}`, message: `${error.message}` });
  }
}
