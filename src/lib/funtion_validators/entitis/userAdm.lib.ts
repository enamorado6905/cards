import { Request, Response } from "express";
import { modelsRol, modelsUserADM, IUserADM } from "../../../models/models";
import { libValid, libValidRol, libValidPhotos } from "../../lib";

var emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\0-9]+\.)+[a-zA-Z]{2,}))$/;
var userPatterrn = /^([a-z]{1}[a-z0-9_]+[\s]*)+$/;
const namesPatterrn = /^([A-ZÁÉÍÓÚ]{1}[a-zñáéíóú]+[\s]*)+$/;
var isnumber = /^([0-9])*$/;
var isAZ = /^[A-Z]*/;

export function getExpNames(): RegExp {
  return namesPatterrn;
}
export function getExpUser(): RegExp {
  return userPatterrn;
}
export function getExpEmail(): RegExp {
  return emailPattern;
}
export function getExpNumber(): RegExp {
  return isnumber;
}
export function getExpAZ(): RegExp {
  return isAZ;
}
export async function UserADMID(ID: string): Promise<IUserADM | null> {
  const user: IUserADM | null = await modelsUserADM.findById(ID, {
    password: 0,
  });
  return user;
}
async function UserADMUser(user: string): Promise<IUserADM | null> {
  await modelsUserADM.createIndexes([
    {
      user: 1,
    },
  ]);
  return await modelsUserADM.findOne({
    user: { $eq: user },
  });
}
async function UserADMEmail(email: string): Promise<IUserADM | null> {
  await modelsUserADM.createIndexes([
    {
      email: 1,
    },
  ]);
  return await modelsUserADM.findOne({
    email: { $eq: email },
  });
}
async function UserADMIDPassword(ID: string): Promise<IUserADM | null> {
  const user: IUserADM | null = await modelsUserADM.findById(ID, {
    password: 1,
  });
  return user;
}
async function UserADMList(
  limit: number,
  max: number
): Promise<Array<IUserADM> | null> {
  const UserADM_: Array<IUserADM> | null = await modelsUserADM
    .find(
      {},
      {
        name: 1,
        nametwo: 1,
        lastnameone: 1,
        lastnametwo: 1,
        idimgData: 1,
        createdAt: 1,
      }
    )
    .skip(limit)
    .limit(max);
  return UserADM_;
}
async function Search(
  limit: number,
  max: number,
  paramSearch: {
    name: any;
    nametwo: any;
    lastnameone: any;
    lastnametwo: any;
    user: any;
    email: any;
    active: any;
    rol: any;
  }
): Promise<Array<IUserADM> | null> {
  await modelsUserADM.createIndexes([
    {
      name: 1,
    },
    {
      nametwo: 1,
    },
    {
      lastnameone: 1,
    },
    {
      lastnametwo: 1,
    },
    {
      user: 1,
    },
    {
      email: 1,
    },
    {
      active: 1,
    },
    {
      rol: 1,
    },
  ]);
  const users: Array<IUserADM> | null = await modelsUserADM
    .find(
      {
        $or: [
          { name: { $regex: `${paramSearch.name}`, $options: "i" } },
          { nametwo: { $regex: `${paramSearch.nametwo}`, $options: "i" } },
          {
            lastnameone: {
              $regex: `${paramSearch.lastnameone}`,
              $options: "i",
            },
          },
          {
            lastnametwo: {
              $regex: `${paramSearch.lastnametwo}`,
              $options: "i",
            },
          },
          { user: { $eq: paramSearch.user } },
          { email: { $eq: paramSearch.email } },
          { active: { $eq: paramSearch.active! } },
          { rol: { $eq: paramSearch.rol } },
        ],
      },
      {
        name: 1,
        nametwo: 1,
        lastnameone: 1,
        lastnametwo: 1,
        idimgData: 1,
        createdAt: 1,
      }
    )
    .skip(limit)
    .limit(max);
  return users;
}
export async function SearchLogin(
  paramSearch: string
): Promise<IUserADM | null> {
  await modelsUserADM.createIndexes([
    {
      user: 1,
    },
    {
      email: 1,
    },
  ]);
  const user: IUserADM | null = await modelsUserADM.findOne(
    {
      $or: [{ user: { $eq: paramSearch } }, { email: { $eq: paramSearch } }],
    },
    {
      _id: 1,
      password: 1,
    }
  );
  return user;
}
export async function UserADMIDForPhoto(ID: string): Promise<IUserADM | null> {
  const user: IUserADM | null = await modelsUserADM.findById(ID, {
    idimgData: 1,
  });
  return user;
}
export async function GETADMS(req: Request, res: Response): Promise<Response> {
  try {
    const obLimitMax:
      | { limit: number; max: number }
      | undefined = libValid.ValidPaginaton_Limit_Max(req);
    if (!obLimitMax) {
      return res.status(400).json({
        type: `ERROR`,
        message: "Invalid track in URL parameterm",
      });
    }
    let allUser: any, user: any;
    await Promise.all([
      (allUser = await modelsUserADM.estimatedDocumentCount()),
      (user = await UserADMList(obLimitMax.limit, obLimitMax.max)),
    ]);
    if (!user || allUser === 0) {
      return res.status(404).json({
        type: `ERROR`,
        message: "Not element in the DB",
      });
    }
    return res.status(200).json({ user, allUser });
  } catch (error) {
    return res.status(500).json({
      type: error.type,
      message: error.message,
    });
  }
}
export async function GETADM(req: Request, res: Response): Promise<Response> {
  try {
    let user: IUserADM | null = await UserADMID(req.params.id);
    if (!user) {
      return res.status(404).json({
        type: `ERROR`,
        message: "Not element in the DB",
      });
    }
    await modelsRol.populate(user, {
      path: "rol",
      justOne: true,
      select: ["name"],
    });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      type: error.type,
      message: error.message,
    });
  }
}
export async function ADDADM(req: Request, res: Response): Promise<Response> {
  try {
    const newUser = {
      name: req.body.name,
      nametwo: req.body.nametwo,
      lastnameone: req.body.lastnameone,
      lastnametwo: req.body.lastnametwo,
      email: req.body.email,
      rol: req.body.rol,
      user: req.body.user,
      password: req.body.password,
      active: req.body.active,
    };
    if (!(await libValidRol.RolID(newUser.rol))) {
      return res.status(400).json({
        type: "ERROR",
        message: "Wrong Date",
      });
    }
    await new modelsUserADM(newUser).save();
    return res
      .status(201)
      .json({ type: "SUCCESS", message: "Successfully Create" });
  } catch (error) {
    return res.status(400).json({
      type: error.type,
      message: error.message,
    });
  }
}
export async function EDITADM(req: Request, res: Response): Promise<Response> {
  try {
    const editUser = {
      _id: req.body._id,
      name: req.body.name,
      nametwo: req.body.nametwo,
      lastnameone: req.body.lastnameone,
      lastnametwo: req.body.lastnametwo,
      user: req.body.user,
    };
    let user: IUserADM | null = await UserADMID(editUser._id);
    if (!user) {
      return res.status(404).json({
        type: `ERROR`,
        message: "Not element in the DB",
      });
    }
    await user.updateOne(editUser, {
      runValidators: true,
    });
    return res
      .status(201)
      .json({ type: "SUCCESS", message: "User ADM Update Successfully" });
  } catch (error) {
    return res.status(400).json({
      type: error.type,
      message: error.message,
    });
  }
}
export async function EDITROL(req: Request, res: Response): Promise<Response> {
  try {
    const editUser = {
      _id: req.body._id,
      rol: req.body.rol,
    };
    let rol: any, userADM: any;
    await Promise.all([
      (rol = await libValidRol.RolID(editUser.rol)),
      (userADM = await UserADMID(editUser._id)),
    ]);
    if (!rol || !userADM) {
      return res.status(404).json({
        type: "ERROR",
        message: "Wrong Date",
      });
    }
    await userADM.updateOne(editUser, {
      runValidators: true,
      new: true,
    });
    return res
      .status(201)
      .json({ type: "SUCCESS", message: "User ADM Update Successfully" });
  } catch (error) {
    return res.status(400).json({
      type: error.type,
      message: error.message,
    });
  }
}
export async function EDITPASSWORD(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { _id, password_old, password_new } = req.body;
    let userADM: any, pass: any;
    await Promise.all([
      (userADM = await UserADMIDPassword(_id)),
      (pass = await userADM.validators(password_old)),
    ]);
    if (!userADM || !pass) {
      return res.status(403).json({
        type: `ERROR`,
        message: `Not dectect User or Password is incorrect`,
      });
    }
    (userADM.password = await userADM.encrypt(password_new)),
      await userADM.updateOne(
        { password: userADM.password },
        { runValidators: true }
      );
    return res
      .status(201)
      .json({ type: "SUCCESS", message: "Password updated" });
  } catch (error) {
    return res.status(400).json({
      type: error.type,
      message: error.message,
    });
  }
}
export async function VALIDUSERADD(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { user } = req.body;
    const userADM: IUserADM | null = await UserADMUser(user);
    if (userADM) {
      return res.status(200).json(true);
    } else {
      return res.status(200).json(false);
    }
  } catch (error) {
    return res.status(500).json({
      type: error.type,
      message: error.message,
    });
  }
}
export async function VALIDUSEREDIT(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { id } = req.params;
    const { user } = req.body;
    const userADM: IUserADM | null = await UserADMUser(user);
    if (userADM && userADM._id != id) {
      return res.status(200).json(true);
    } else if (userADM && userADM?._id === id) {
      return res.status(200).json(false);
    } else {
      return res.status(200).json(false);
    }
  } catch (error) {
    return res.status(500).json({
      type: error.type,
      message: error.message,
    });
  }
}
export async function VALIDEMAILADD(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { email } = req.body;
    const userADM: IUserADM | null = await UserADMEmail(email);
    if (userADM) {
      return res.status(200).json(true);
    } else {
      return res.status(200).json(false);
    }
  } catch (error) {
    return res.status(500).json({
      type: error.type,
      message: error.message,
    });
  }
}
export async function VALIDEMAILEDIT(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { id } = req.params;
    const { email } = req.body;
    const userADM: IUserADM | null = await UserADMEmail(email);
    if (userADM && userADM._id != id) {
      return res.status(200).json(true);
    } else if (userADM && userADM?._id === id) {
      return res.status(200).json(false);
    } else {
      return res.status(200).json(false);
    }
  } catch (error) {
    return res.status(500).json({
      type: error.type,
      message: error.message,
    });
  }
}
export async function DELETEUSERADM(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    let IDS: any = req.body.ids;
    for (const m of IDS) {
      const user = await UserADMID(m);
      if (!user) {
        return res.status(404).json({
          type: `ERROR`,
          message: "No detect User in the DB",
        });
      }
      if (user.idimgData) {
        libValidPhotos.DeletePhoto(user.idimgData);
      }
      await user.deleteOne();
    }
    return res
      .status(201)
      .json({ type: "SUCCESS", message: `Delete Successfully` });
  } catch (error) {
    return res.status(500).json({
      type: error.name,
      message: error.message,
    });
  }
}
export async function SEARCH(req: Request, res: Response): Promise<Response> {
  try {
    let params = {
      name: req.query.name,
      nametwo: req.query.nametwo,
      lastnameone: req.query.lastnameone,
      lastnametwo: req.query.lastnametwo,
      user: req.query.user,
      email: req.query.email,
      active: req.query.active,
      rol: req.query.rol,
    };
    if (req.url.indexOf("?") === 0) {
      return res.status(400).json({
        type: "ERROR",
        message: "Invalid track in URL parameterm, Limit and Max is null",
      });
    }
    const limits = libValid.ValidPaginaton_Limit_Max(req);
    if (!limits) {
      return res.status(400).json({
        type: "ERROR",
        message: "Invalid track in URL parameterm, Limit and Max is null",
      });
    }
    if (params.rol) {
      const rol = await libValidRol.RolNAME(params.rol.toString());
      params.rol = rol?._id!;
    }
    let listUsers: Array<IUserADM> | null = await Search(
      limits.limit,
      limits.max,
      params
    );
    if (!listUsers) {
      return res.status(403).json({
        type: `ERROR`,
        message: "Not element in the DB",
      });
    }
    let allUser: number = listUsers.length;
    return res.status(200).json({ listUsers, allUser });
  } catch (error) {
    return res.status(500).json({
      type: error.type,
      message: error.message,
    });
  }
}
