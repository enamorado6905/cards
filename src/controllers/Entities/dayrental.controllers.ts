import { Request, Response } from "express";
import { libValidDayRental } from "../../lib/lib";

export async function GETDAYRENTALS(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidDayRental.GETDAYRENTALS(req, res);
}
export async function GETDAYRENTAL(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidDayRental.GETDAYRENTAL(req, res);
}
export async function ADDDAYRENTAL(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidDayRental.ADDDAYRENTAL(req, res);
}
export async function EDITDAYRENTAL(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidDayRental.EDITDAYRENTAL(req, res);
}
export async function DELETEDAYRENTAL(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidDayRental.DELETEDAYRENTAL(req, res);
}
export async function SEARCHDAYRENTAL(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidDayRental.SEARCH(req, res);
}
