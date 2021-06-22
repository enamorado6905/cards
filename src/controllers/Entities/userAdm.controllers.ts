import { Request, Response } from "express";
import { libValidUserADM, libValidPhotos } from "../../lib/lib";

export async function GETUSERADMS(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidUserADM.GETADMS(req, res);
}
export async function GETUSERADM(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidUserADM.GETADM(req, res);
}
export async function ADDUSERADM(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidUserADM.ADDADM(req, res);
}
export async function DELETEUSERADM(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidUserADM.DELETEUSERADM(req, res);
}
export async function EDITUSERADM(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidUserADM.EDITADM(req, res);
}
export async function EDITROLUSERADM(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidUserADM.EDITROL(req, res);
}
export async function EDITPASSWORD(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidUserADM.EDITPASSWORD(req, res);
}
export async function ADDPHOTOADM(
  req: Request,
  res: Response
): Promise<Response | void> {
  return await libValidPhotos.ADDPhotoADM(req, res);
}
export async function VALIDUSERADD(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidUserADM.VALIDUSERADD(req, res);
}
export async function VALIDUSEREDIT(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidUserADM.VALIDUSEREDIT(req, res);
}
export async function VALIDEMAILADD(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidUserADM.VALIDEMAILADD(req, res);
}
export async function VALIDEMAILEDIT(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidUserADM.VALIDEMAILEDIT(req, res);
}
export async function SEARCHUSERADM(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidUserADM.SEARCH(req, res);
}
