import { Schema, model, Document } from "mongoose";
import bcryptjs from "bcryptjs";
import { IRol } from "../../models/models";
import { libValidUserADM } from "../../lib/lib";

const userschema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 70,
      trim: true,
      match: libValidUserADM.getExpNames(),
    },
    nametwo: {
      type: String,
      maxlength: 30,
      trim: true,
      match: libValidUserADM.getExpNames(),
    },
    lastnameone: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 70,
      trim: true,
      match: libValidUserADM.getExpNames(),
    },
    lastnametwo: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 70,
      trim: true,
      match: libValidUserADM.getExpNames(),
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: libValidUserADM.getExpEmail(),
    },
    rol: {
      ref: "Rol",
      type: Schema.Types.ObjectId,
      required: true,
    },
    user: {
      type: String,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 70,
      unique: true,
      match: libValidUserADM.getExpUser(),
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    idimgData: { type: String },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
export interface IUserADM extends Document {
  name: string;
  nametwo: string;
  lastnameone: string;
  lastnametwo: string;
  email: string;
  rol: IRol;
  user: string;
  password: string;
  idimgData: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  encrypt(password: string): Promise<string>;
  validators(password: string): Promise<boolean>;
}
userschema.methods.encrypt = async function (
  password: string
): Promise<string> {
  return bcryptjs.hash(password, await bcryptjs.genSalt(10));
};
userschema.methods.validators = async function (
  password_: string
): Promise<boolean> {
  return await bcryptjs.compare(password_, this.get("password"));
};
userschema.pre<IUserADM>("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  let plaintext = this.get("password");
  this.set("password", bcryptjs.hashSync(plaintext, 10));
  return next();
});
export default model<IUserADM>("UserADM", userschema);
