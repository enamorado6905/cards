import { Schema, model, Document } from "mongoose";
import { ICard, IUser } from "../models";
const schema = new Schema(
  {
    dayrental: {
      type: Date,
      required: true,
    },
    daytoprental: {
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
export interface IRental extends Document {
  dayrental: Date;
  daytoprental: Date;
  price: number;
  user: IUser;
  card: ICard;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
}

export default model<IRental>("Rental", schema);
