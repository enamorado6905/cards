import { Request, Response } from "express";
import { libValidPhotos } from "../../lib/lib";
export async function GETPhoto(
  req: Request,
  res: Response
): Promise<Response | void> {
  return await libValidPhotos.GETPhoto(req, res);
}
export async function ADDPhotoADM(
  req: Request,
  res: Response
): Promise<Response | void> {
  return await libValidPhotos.ADDPhotoADM(req, res);
}
export async function ADDPhotoCARD(
  req: Request,
  res: Response
): Promise<Response | void> {
  return await libValidPhotos.ADDPhotoCARD(req, res);
}
