import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { IUserADM, IUser } from "../../models/models";
import { libValidUserADM, libValidUser, libValidRol } from "../../lib/lib";

export async function loginADM(req: Request, res: Response): Promise<Response> {
  try {
    let user: IUserADM | null = await libValidUserADM.SearchLogin(
      req.body.params
    );
    if (!user || !(await user.validators(req.body.password)) || !user.active) {
      return res.status(401).json({
        type: `ERROR`,
        message: "Wrong Date",
      });
    }
    const rol = await libValidRol.RolID(user.rol._id);
    let token_ref: any = jwt.sign(
      { _id: user._id },
      process.env.TOKEN_SECRET || "TOKEN_TXT",
      {
        expiresIn: "1d",
      }
    );
    let token: any = jwt.sign(
      { _id: user._id, rol: rol?.name },
      process.env.TOKEN_SECRET || "TOKEN_TXT",
      {
        expiresIn: "12000s",
      }
    );
    return res.status(200).header("authtoken", token).json({
      type: `SUSSECES`,
      message: `susseces autentication`,
      token: token,
      token_ref: token_ref,
      id: user._id,
    });
  } catch (error) {
    return res.status(401).json({
      type: error.name,
      message: error.message,
    });
  }
}
export async function login(req: Request, res: Response): Promise<Response> {
  try {
    let user: IUser | null = await libValidUser.SearchLogin(req.body.params);
    if (!user || !(await user.validators(req.body.password)) || !user.active) {
      return res.status(401).json({
        type: `ERROR`,
        message: "Wrong Date",
      });
    }
    let token_ref: any = jwt.sign(
      { _id: user._id },
      process.env.TOKEN_SECRET || "TOKEN_TXT",
      {
        expiresIn: "1d",
      }
    );
    let token: any = jwt.sign(
      { _id: user._id },
      process.env.TOKEN_SECRET || "TOKEN_TXT",
      {
        expiresIn: "12000s",
      }
    );
    return res.status(200).header("authtoken", token).json({
      type: `SUSSECES`,
      message: `susseces autentication`,
      token: token,
      token_ref: token_ref,
      id: user._id,
    });
  } catch (error) {
    return res.status(401).json({
      type: error.name,
      message: error.message,
    });
  }
}
export async function refreshADM(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    let token: any = req.headers.token_ref;
    if (!token) {
      return res.status(401).json({
        type: `ERROR`,
        message: "UNATHORIZE REQUEST",
      });
    }
    const data: any = jwt.verify(
      token.toString(),
      process.env.TOKEN_SECRET || "TOKEN_TXT"
    );
    let user: IUserADM | null = await libValidUserADM.UserADMID(data._id);
    if (!user) {
      return res.status(401).json({
        type: `ERROR`,
        message: "UNATHORIZE REQUEST",
      });
    }
    token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET || "", {
      expiresIn: "12000s",
    });
    return res.status(200).json({
      type: `SUSSECES`,
      message: `Refresh Success`,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      type: error.type,
      message: error.message,
    });
  }
}
