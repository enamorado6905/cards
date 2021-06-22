import { Request, Response } from "express";
import { ObjectID, GridFSBucket } from "mongodb";
import { getConnectionImagens } from "../../database";
import { IUserADM, IRol } from "../../models/models";
import { libValidRol } from "../../lib/lib";
/**
 * Return true if value is true is value is equals a elemnt in array
 */
export function checkPermission(rol: IRol | undefined, value: string): boolean {
  if (!rol) {
    return false;
  }
  if (rol.name === value) {
    return true;
  }
  return false;
}
export async function checkallPermission(
  rol: IRol | undefined
): Promise<boolean> {
  if (!rol) {
    return false;
  }
  if (!(await libValidRol.RolID(rol._id))) {
    return true;
  }
  return false;
}
/**
 * Return true if value is number
 */
export function is_numeric(value: string): boolean {
  return !isNaN(parseInt(value)) && isFinite(parseInt(value));
}

/**
 * validators url if (limit and max) is !null || undefined
 * split url in two wiht param ?, then split array[1] wiht &.
 */
export function ValidPaginaton_Limit_Max(
  req: Request
): { limit: number; max: number } | undefined {
  let { limit, max } = req.query;
  if (!limit || !max) {
    return;
  }
  const limit_ = limit as string;
  const max_ = max as string;
  if (!is_numeric(limit_) || !is_numeric(max_)) {
    return;
  }
  return { limit: Number(limit_), max: Number(max_) };
}
/**
 * this funtion is when Delete (objet and photo);
 * */
export async function DeleteEntitiPhoto(
  req: Request,
  res: Response,
  entiti: IUserADM | null
): Promise<Response> {
  try {
    if (!entiti) {
      return res.status(404).json({
        type: `ERROR`,
        message: "Not element in the DB",
      });
    }
    if (entiti.idimgData) {
      DeletePhoto(entiti.idimgData);
    }
    await entiti.remove();
    return res
      .status(201)
      .json({ type: "SUCCESS", message: `Delete Successfully` });
  } catch (error) {
    throw new Error(error);
  }
}
/**
 * This funtion is when delete entiti delete photo
 */
export function DeletePhoto(id: string): void {
  try {
    const trackID = new ObjectID(id);
    const bucket = new GridFSBucket(getConnectionImagens(), {
      bucketName: "tracksImg",
    });
    bucket.delete(trackID);
  } catch (error) {
    throw new Error(error);
  }
}
/**
 * This funtion is when Edit valid is objet is distint null
 */
export async function EDIT_Objet(
  objet: IUserADM | null,
  value: object
): Promise<void> {
  try {
    if (!objet) {
      throw new Error("No edit Objet is Null");
    } else {
      await objet.updateOne(value, { runValidators: true, new: true });
    }
  } catch (error) {
    throw new Error(error);
  }
}
