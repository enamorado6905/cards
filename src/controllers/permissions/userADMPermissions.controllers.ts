import { Request, Response } from "express";
import { libValidPermissions } from "../../lib/lib";

export async function GETPERMISSIONS(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidPermissions.GETPERMISSIONS(req, res);
}
export async function GETPERMISSION(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidPermissions.GETPERMISSION(req, res);
}
export async function ADDPERMISSION(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidPermissions.ADDPERMISSION(req, res);
}
export async function EDITPERMISSION(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidPermissions.EDITPERMISSION(req, res);
}
export async function DELETEPERMISSIONS(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidPermissions.DELETEPERMISSIONS(req, res);
}
export async function DELETEPERMISSION(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidPermissions.DELETEPERMISSION(req, res);
}
export async function VALIDNAMEADD(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidPermissions.VALIDNAMEADD(req, res);
}
export async function VALIDNAMEEDIT(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidPermissions.VALIDNAMEEDIT(req, res);
}
export async function SEARCHPERMISSIONS(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidPermissions.SEARCH(req, res);
}
