import { Request, Response } from "express";
import { libValidPrice } from "../../lib/lib";

export async function GETPRICES(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidPrice.GETPRICES(req, res);
}
export async function GETPRICE(req: Request, res: Response): Promise<Response> {
  return await libValidPrice.GETPRICE(req, res);
}
export async function ADDPRICE(req: Request, res: Response): Promise<Response> {
  return await libValidPrice.ADDPRICE(req, res);
}
export async function EDITPRICE(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidPrice.EDITPRICE(req, res);
}
export async function DELETEPRICE(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidPrice.DELETEPRICE(req, res);
}
export async function SEARCHPRICES(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidPrice.SEARCH(req, res);
}
