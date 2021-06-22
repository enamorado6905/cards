import { Schema, model, Document } from "mongoose";
const Admrolschema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 70,
      unique: true,
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
export interface IRol extends Document {
  name: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export default model<IRol>("Rol", Admrolschema);
