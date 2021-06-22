import { Schema, model, Document } from "mongoose";

const schema = new Schema(
  {
    description: {
      type: String,
      minlength: 3,
      maxlength: 70,
      required: true,
      unique: true,
    },
    dayrental: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    active: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export interface IDayRental extends Document {
  description: string;
  dayrental: Date;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
}

export default model<IDayRental>("DayRental", schema);
