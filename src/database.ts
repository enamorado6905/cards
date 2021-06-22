import mongoose from "mongoose";
import { MongoClient } from "mongodb";

let URI = process.env.MONGODB_URI ? process.env.MONGODB_URI : "";
let URI_PHOTO = process.env.MONGODB_URI_PHOTO
  ? process.env.MONGODB_URI_PHOTO
  : "";
let NAME_PHOTO = process.env.NAME_URI_PHOTO ? process.env.NAME_URI_PHOTO : "";
let URITRACKSIMAGEN: any;
export async function startConnection() {
  await mongoose.connect(
    URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    },
    (err) => {
      if (err) {
        console.log(err);
        process.exit(0);
      }
      console.log("DB is connected");
    }
  );
}
MongoClient.connect(URI_PHOTO, { useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.log(err);
    process.exit(0);
  }
  URITRACKSIMAGEN = client.db(NAME_PHOTO);
  console.log("PHOTO DB is connected");
});
export function getConnectionImagens() {
  return URITRACKSIMAGEN;
}
