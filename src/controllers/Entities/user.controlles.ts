import { Request, Response } from "express";
import { libValidUser } from "../../lib/lib";

export async function GETUSERS(req: Request, res: Response): Promise<Response> {
  return await libValidUser.GETUSERS(req, res);
}
export async function GETUSER(req: Request, res: Response): Promise<Response> {
  return await libValidUser.GETUSER(req, res);
}
export async function ADDUSER(req: Request, res: Response): Promise<Response> {
  return await libValidUser.ADDUSER(req, res);
}
export async function EDITUSER(req: Request, res: Response): Promise<Response> {
  return await libValidUser.EDITUSER(req, res);
}
export async function EDITROLUSER(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidUser.EDITROL(req, res);
}
export async function EDITPASSWORDUSER(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidUser.EDITPASSWORD(req, res);
}
export async function DELETEUSER(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidUser.DELETEUSER(req, res);
}
export async function VALIDUSERADD(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidUser.VALIDUSERADD(req, res);
}
export async function VALIDUSEREDIT(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidUser.VALIDUSEREDIT(req, res);
}
export async function VALIDEMAILADD(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidUser.VALIDEMAILADD(req, res);
}
export async function VALIDEMAILEDIT(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidUser.VALIDEMAILEDIT(req, res);
}
export async function SEARCHUSER(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidUser.SEARCH(req, res);
}
