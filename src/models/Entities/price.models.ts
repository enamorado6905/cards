import { Schema, model, Document } from "mongoose";
import { IUser, ICard } from "../models";
const schema = new Schema(
  {
    day: {
      type: Date,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    user: {
      ref: "User",
      type: Schema.Types.ObjectId,
      required: true,
    },
    card: {
      ref: "Card",
      type: Schema.Types.ObjectId,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
export interface IPrice extends Document {
  day: Date;
  price: number;
  user: IUser;
  card: ICard;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
}

export default model<IPrice>("Price", schema);
