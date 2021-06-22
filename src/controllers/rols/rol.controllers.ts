import { Request, Response } from "express";
import { libValidRol } from "../../lib/lib";
export async function GETROLS(req: Request, res: Response): Promise<Response> {
  return await libValidRol.GETROLS(req, res);
}
export async function GETROL(req: Request, res: Response): Promise<Response> {
  return await libValidRol.GETROL(req, res);
}
export async function ADDROL(req: Request, res: Response): Promise<Response> {
  return await libValidRol.ADDROL(req, res);
}
export async function EDITROL(req: Request, res: Response): Promise<Response> {
  return await libValidRol.EDITROL(req, res);
}
export async function DELETEROL(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidRol.DELETEROL(req, res);
}
export async function VALIDNAMEADD(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidRol.VALIDNAMEADD(req, res);
}
export async function VALIDNAMEEDIT(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidRol.VALIDNAMEEDIT(req, res);
}
export async function SEARCHROLS(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidRol.SEARCH(req, res);
}
