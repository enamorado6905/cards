import { Schema, model, Document } from "mongoose";

const schema = new Schema(
  {
    type: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 70,
      unique: true,
    },
    description: {
      type: String,
      minlength: 3,
      maxlength: 200,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    allcard: {
      type: Number,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    idimgData: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
export interface ICard extends Document {
  type: string;
  description: string;
  price: number;
  allcard: number;
  active: boolean;
  idimgData: string;
  createdAt: Date;
  updatedAt: Date;
}

export default model<ICard>("Card", schema);
