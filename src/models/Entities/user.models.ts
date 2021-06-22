import { Schema, model, Document } from "mongoose";
import bcryptjs from "bcryptjs";
import { IRol } from "../../models/models";
//import { libValid } from "../../lib/lib";

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 70,
      trim: true,
      // match: libValidUserADM.getExpNames(),
    },
    user: {
      type: String,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 70,
      unique: true,
      //  match: libValidUserADM.getExpUser(),
    },
    email: {
      type: String,
      required: true,
      unique: true,
      // match: libValidUserADM.getExpEmail(),
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    rol: {
      ref: "Rol",
      type: Schema.Types.ObjectId,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export interface IUser extends Document {
  name: string;
  user: string;
  email: string;
  password: string;
  rol: IRol;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  encrypt(password: string): Promise<string>;
  validators(password: string): Promise<boolean>;
}
schema.methods.encrypt = async function (password: string): Promise<string> {
  return bcryptjs.hash(password, await bcryptjs.genSalt(10));
};
schema.methods.validators = async function (
  password_: string
): Promise<boolean> {
  return await bcryptjs.compare(password_, this.get("password"));
};
schema.pre<IUser>("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  let plaintext = this.get("password");
  this.set("password", bcryptjs.hashSync(plaintext, 10));
  return next();
});

export default model<IUser>("User", schema);
