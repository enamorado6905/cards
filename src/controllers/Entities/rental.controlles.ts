import { Request, Response } from "express";
import { libValidRental } from "../../lib/lib";

export async function GETRENTALS(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidRental.GETRENTALS(req, res);
}
export async function GETRENTAL(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidRental.GETRENTAL(req, res);
}
export async function ADDRENTAL(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidRental.ADDRENTAL(req, res);
}
export async function EDITRENTAL(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidRental.EDITRENTAL(req, res);
}
export async function DELETERENTAL(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidRental.DELETERENTAL(req, res);
}
export async function DELETERENTALS(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidRental.DELETERENTALS(req, res);
}
export async function SEARCHRENTALS(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidRental.SEARCH(req, res);
}
