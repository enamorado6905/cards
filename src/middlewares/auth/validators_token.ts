import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {
  modelsRol,
  modelsUserADM,
  modelsUser,
  IUserADM,
} from "../../models/models";

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
    let user: any, userADM: any;
    Promise.all([
      (user = await modelsUser.findById(data._id, {
        rol: 1,
        active: 1,
      })),
      (userADM = await modelsUserADM.findById(data._id, {
        rol: 1,
        active: 1,
      })),
    ]);
    if (user && !userADM) {
      await modelsRol.populate(user, {
        path: "rol",
        justOne: true,
        select: ["name"],
      });
      req.body.ROL = user.rol;
      return user.rol ? next() : res.status(401).json("ANUTHORIZE REQUEST");
    } else if (userADM && !user) {
      await modelsRol.populate(userADM, {
        path: "rol",
        justOne: true,
        select: ["name"],
      });
      return userADM.rol ? next() : res.status(401).json("ANUTHORIZE REQUEST");
    }
    return res.status(401).json("ANUTHORIZE REQUEST");
  } catch (error) {
    return res
      .status(403)
      .json({ type: `${error.type}`, message: `${error.message}` });
  }
}
