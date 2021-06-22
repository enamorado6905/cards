import { Request, Response } from "express";
import { libValidCard, libValidPhotos } from "../../lib/lib";

export async function GETCARDS(req: Request, res: Response): Promise<Response> {
  return await libValidCard.GETCARDS(req, res);
}
export async function GETCARD(req: Request, res: Response): Promise<Response> {
  return await libValidCard.GETCARD(req, res);
}
export async function ADDCARD(req: Request, res: Response): Promise<Response> {
  return await libValidCard.ADDCARD(req, res);
}
export async function EDITCARD(req: Request, res: Response): Promise<Response> {
  return await libValidCard.EDITCARD(req, res);
}
export async function DELETECARD(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidCard.DELETECARD(req, res);
}
export async function ADDPHOTOCARD(
  req: Request,
  res: Response
): Promise<Response | void> {
  return await libValidPhotos.ADDPhotoCARD(req, res);
}
export async function VALIDTITLEADD(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidCard.VALIDTITLEADD(req, res);
}
export async function VALIDTILTEEDIT(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidCard.VALIDTITLEEDIT(req, res);
}
export async function SEARCHCARD(
  req: Request,
  res: Response
): Promise<Response> {
  return await libValidCard.SEARCH(req, res);
}
