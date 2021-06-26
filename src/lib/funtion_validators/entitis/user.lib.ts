import { Request, Response } from "express";
import { modelsRol, modelsUser, IUser } from "../../../models/models";
import { libValid, libValidRol } from "../../lib";

var emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\0-9]+\.)+[a-zA-Z]{2,}))$/;
var userPatterrn = /^([a-z]{1}[a-z0-9_]+[\s]*)+$/;
var namesPatterrn = /^([A-ZÁÉÍÓÚ]{1}[a-zñáéíóú]+[\s]*)+$/;

export function getExpNames(): RegExp {
  return namesPatterrn;
}
export function getExpUser(): RegExp {
  return userPatterrn;
}
export function getExpEmail(): RegExp {
  return emailPattern;
}

export async function UserID(ID: string): Promise<IUser | null> {
  return await modelsUser.findById(ID, {
    password: 0,
  });
}
async function UserUser(user: string): Promise<IUser | null> {
  await modelsUser.createIndexes([
    {
      user: 1,
    },
  ]);
  return await modelsUser.findOne({
    user: { $eq: user },
  });
}
async function UserEmail(email: string): Promise<IUser | null> {
  await modelsUser.createIndexes([
    {
      email: 1,
    },
  ]);
  return await modelsUser.findOne({
    email: { $eq: email },
  });
}
async function UserIDPassword(ID: string): Promise<IUser | null> {
  return await modelsUser.findById(ID, {
    password: 1,
  });
}
async function UserList(
  limit: number,
  max: number
): Promise<Array<IUser> | null> {
  const User_: Array<IUser> | null = await modelsUser
    .find(
      {},
      {
        name: 1,
        user: 1,
        createdAt: 1,
      }
    )
    .skip(limit)
    .limit(max);
  return User_;
}
async function Search(
  limit: number,
  max: number,
  paramSearch: {
    name: any;
    user: any;
    email: any;
    active: any;
    rol: any;
  }
): Promise<Array<IUser> | null> {
  await modelsUser.createIndexes([
    {
      name: 1,
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
  const users: Array<IUser> | null = await modelsUser
    .find(
      {
        $or: [
          { name: { $regex: `${paramSearch.name}`, $options: "i" } },
          { user: { $eq: paramSearch.user } },
          { email: { $eq: paramSearch.email } },
          { active: { $eq: paramSearch.active! } },
          { rol: { $eq: paramSearch.rol } },
        ],
      },
      {
        name: 1,
        user: 1,
        createdAt: 1,
      }
    )
    .skip(limit)
    .limit(max);
  return users;
}
export async function SearchLogin(paramSearch: string): Promise<IUser | null> {
  await modelsUser.createIndexes([
    {
      user: 1,
    },
    {
      email: 1,
    },
  ]);
  const user: IUser | null = await modelsUser.findOne(
    {
      $or: [{ user: { $eq: paramSearch } }, { email: { $eq: paramSearch } }],
    },
    {
      _id: 1,
      password: 1,
      active: 1,
      rol: 1,
    }
  );
  return user;
}
export async function GETUSERS(req: Request, res: Response): Promise<Response> {
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
      (allUser = await modelsUser.estimatedDocumentCount()),
      (user = await UserList(obLimitMax.limit, obLimitMax.max)),
    ]);
    if (allUser === 0 || !user) {
      return res.status(404).json({
        type: `ERROR`,
        message: "Not element in the DB",
      });
    }
    return res.status(200).json({ user, allUser });
  } catch (error) {
    return res.status(500).json({
      type: error.name,
      message: error.message,
    });
  }
}
export async function GETUSER(req: Request, res: Response): Promise<Response> {
  try {
    let user: IUser | null = await UserID(req.params.id);
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
      type: error.name,
      message: error.message,
    });
  }
}
export async function ADDUSER(req: Request, res: Response): Promise<Response> {
  try {
    const newUser = {
      name: req.body.name,
      email: req.body.email,
      rol: req.body.rol,
      user: req.body.user,
      password: req.body.password,
      active: req.body.active,
    };
    const rol = await modelsRol.findOne({ name: "USER" });
    if (!rol) {
      return res.status(400).json({
        type: "ERROR",
        message: "Wrong Date",
      });
    }
    newUser.rol = rol._id;
    await new modelsUser(newUser).save();
    return res
      .status(201)
      .json({ type: "SUCCESS", message: "Successfully Create" });
  } catch (error) {
    return res.status(400).json({
      type: error.name,
      message: error.message,
    });
  }
}
export async function EDITUSER(req: Request, res: Response): Promise<Response> {
  try {
    const editUser = {
      _id: req.body._id,
      name: req.body.name,
      user: req.body.user,
    };
    let user: IUser | null = await UserID(editUser._id);
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
      .json({ type: "SUCCESS", message: "Update Successfully" });
  } catch (error) {
    return res.status(400).json({
      type: error.name,
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
    let user: any, rol: any;
    await Promise.all([
      (rol = await libValidRol.RolID(editUser.rol)),
      (user = await UserID(editUser._id)),
    ]);
    if (!user || !rol) {
      return res.status(404).json({
        type: `ERROR`,
        message: "Not element in the DB",
      });
    }
    await user.updateOne(editUser, {
      runValidators: true,
      new: true,
    });
    return res
      .status(201)
      .json({ type: "SUCCESS", message: "User USER Update Successfully" });
  } catch (error) {
    return res.status(400).json({
      type: error.name,
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
    let user: any, pass: any;
    await Promise.all([
      (user = await UserIDPassword(_id)),
      (pass = await user.validators(password_old)),
    ]);
    if (!user || !pass) {
      return res.status(403).json({
        type: `ERROR`,
        message: `Not dectect User or Password is incorrect`,
      });
    }
    await user.updateOne(
      { password: await user.encrypt(password_new) },
      { runValidators: true }
    );
    return res
      .status(201)
      .json({ type: "SUCCESS", message: "Password updated" });
  } catch (error) {
    return res.status(400).json({
      type: error.name,
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
    const user_: IUser | null = await UserUser(user);
    if (user_) {
      return res.status(200).json(true);
    } else {
      return res.status(200).json(false);
    }
  } catch (error) {
    return res.status(500).json({
      type: error.name,
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
    const user_: IUser | null = await UserUser(user);
    if (user_ && user_._id != id) {
      return res.status(200).json(true);
    } else if (user_ && user_._id === id) {
      return res.status(200).json(false);
    } else {
      return res.status(200).json(false);
    }
  } catch (error) {
    return res.status(500).json({
      type: error.name,
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
    const user: IUser | null = await UserEmail(email);
    if (user) {
      return res.status(200).json(true);
    } else {
      return res.status(200).json(false);
    }
  } catch (error) {
    return res.status(500).json({
      type: error.name,
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
    const user: IUser | null = await UserEmail(email);
    if (user && user._id != id) {
      return res.status(200).json(true);
    } else if (user && user?._id === id) {
      return res.status(200).json(false);
    } else {
      return res.status(200).json(false);
    }
  } catch (error) {
    return res.status(500).json({
      type: error.name,
      message: error.message,
    });
  }
}
export async function DELETEUSER(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    let IDS: Array<any> = req.body.ids;
    for (const m of IDS) {
      const user = await UserID(m);
      if (!user) {
        return res.status(404).json({
          type: `ERROR`,
          message: "No detect User in the DB",
        });
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
    let listUsers: Array<IUser> | null = await Search(
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
    const allUser = listUsers.length;
    return res.status(200).json({ listUsers, allUser });
  } catch (error) {
    return res.status(500).json({
      type: error.name,
      message: error.message,
    });
  }
}
