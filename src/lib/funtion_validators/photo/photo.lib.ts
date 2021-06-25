import { Request, Response } from "express";
import { ObjectID, GridFSBucket } from "mongodb";
import { getConnectionImagens } from "../../../database";
import { Readable } from "stream";
import { libValidUserADM, libValidCard } from "../../lib";
import { IUserADM, ICard } from "../../../models/models";

export async function onADDPHOTO(
  data: IUserADM | ICard,
  buffer: any
): Promise<any> {
  let readableTrackStream = new Readable();
  let bucket = new GridFSBucket(getConnectionImagens(), {
    bucketName: process.env.NAME_URI_PHOTO ? process.env.NAME_URI_PHOTO : "",
  });
  if (data.idimgData) {
    const idImg = new ObjectID(data.idimgData);
    bucket.delete(idImg);
  }
  let uploadStream = bucket.openUploadStream(data.id);
  readableTrackStream.push(buffer);
  readableTrackStream.push(null);
  readableTrackStream.pipe(uploadStream);
  uploadStream.on("error", (error) => {
    throw new Error(error.message);
  });
  uploadStream.on("finish", async () => {
    await data?.updateOne(
      { idimgData: uploadStream.id.toString() },
      { runValidators: true, new: true }
    );
  });
  return uploadStream.id.toString();
}
export async function onADDPHOTOADD(
  data: IUserADM | ICard,
  buffer: any
): Promise<any> {
  let readableTrackStream = new Readable();
  let bucket = new GridFSBucket(getConnectionImagens(), {
    bucketName: process.env.NAME_URI_PHOTO ? process.env.NAME_URI_PHOTO : "",
  });
  if (data.idimgData) {
    const idImg = new ObjectID(data.idimgData);
    bucket.delete(idImg);
  }
  let uploadStream = bucket.openUploadStream(data.id);
  readableTrackStream.push(buffer);
  readableTrackStream.push(null);
  readableTrackStream.pipe(uploadStream);
  uploadStream.on("error", (error) => {
    throw new Error(error.message);
  });
  uploadStream.on("finish", async () => {});
  return uploadStream.id.toString();
}
export function DeletePhoto(id: string): void {
  try {
    const trackID = new ObjectID(id);
    const bucket = new GridFSBucket(getConnectionImagens(), {
      bucketName: process.env.NAME_URI_PHOTO ? process.env.NAME_URI_PHOTO : "",
    });
    bucket.delete(trackID);
  } catch (error) {
    throw new Error(error);
  }
}
export async function GETPhoto(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    let trackID = new ObjectID(req.params.id);
    if (!trackID) {
      return res.status(400).json({
        type: `ERROR`,
        message: "Invalid track Photo",
      });
    }
    let bucket = new GridFSBucket(getConnectionImagens(), {
      bucketName: process.env.NAME_URI_PHOTO ? process.env.NAME_URI_PHOTO : "",
    });
    let downloadStream = bucket.openDownloadStream(trackID);
    res.set({ "Content-Type": "image/jpeg" });
    res.set({ "accept-ranges": "bytes" });
    downloadStream.on("data", (chunk) => {
      res.write(chunk);
    });
    downloadStream.on("error", () => {
      res.sendStatus(404);
    });
    downloadStream.on("end", () => {
      res.end();
    });
  } catch (error) {
    return res.status(500).json({
      type: `ERROR`,
      message: error.message,
    });
  }
}
export async function ADDPhotoADM(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    let useradm: IUserADM | null = await libValidUserADM.UserADMID(req.body.id);
    if (!useradm) {
      return res.status(404).json({
        type: `ERROR`,
        message: "Not element in the DB",
      });
    }
    const id = await onADDPHOTO(useradm, req.file.buffer);
    if (!id) {
      return res.status(404).json({
        type: `ERROR`,
        message: "Not element in the DB",
      });
    }
    return res.status(201).json({ idimgData: id });
  } catch (error) {
    return res.status(500).json({
      type: error.type,
      message: error.message,
    });
  }
}
export async function ADDPhotoCARD(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    let card: ICard | null = await libValidCard.CardIDForPhoto(req.params.id);
    if (!card) {
      return res.status(404).json({
        type: `ERROR`,
        message: "Not element in the DB",
      });
    }
    const id = await onADDPHOTO(card, req.file.buffer);
    if (!id) {
      return res.status(404).json({
        type: `ERROR`,
        message: "Not element in the DB",
      });
    }
    return res.status(201).json({ idimgData: id });
  } catch (error) {
    return res.status(500).json({
      type: error.type,
      message: error.message,
    });
  }
}
