import { Request, Response } from "express";
import {
  modelsPermissionsUserADM,
  IAdmPermissions,
} from "../../../models/models";
import { libValid } from "../../../lib/lib";

var namesPatterrn = /^([A-ZÁÉÍÓÚ]{1}[a-zñáéíóú]+[\s]*)+$/;

export function getExpNames(): RegExp {
  return namesPatterrn;
}

export async function PermissionsADMID(
  ID: string
): Promise<IAdmPermissions | null> {
  const permissions: IAdmPermissions | null = await modelsPermissionsUserADM.findById(
    ID
  );
  return permissions;
}
export async function PermissionsADMName(
  name: string
): Promise<IAdmPermissions | null> {
  await modelsPermissionsUserADM.createIndexes([
    {
      name: 1,
    },
  ]);
  const permissions: IAdmPermissions | null = await modelsPermissionsUserADM.findOne(
    { name: { $regex: `${name}`, $options: "i" } }
  );
  return permissions;
}
export async function PermissionsADMList(
  limit: number,
  max: number
): Promise<Array<IAdmPermissions> | null> {
  const permissions: Array<IAdmPermissions> | null = await modelsPermissionsUserADM
    .find(
      {},
      {
        name: 1,
        active: 1,
      }
    )
    .skip(limit)
    .limit(max);
  return permissions;
}
export async function Search(
  limit: number,
  max: number,
  paramSearch: {
    name: any;
    active: any;
  }
): Promise<Array<IAdmPermissions> | null> {
  await modelsPermissionsUserADM.createIndexes([
    {
      name: 1,
    },
    {
      active: 1,
    },
  ]);
  const permissions: Array<IAdmPermissions> | null = await modelsPermissionsUserADM
    .find(
      {
        $or: [
          { name: { $regex: `${paramSearch.name}`, $options: "i" } },
          { active: paramSearch.active },
        ],
      },
      {
        name: 1,
        active: 1,
      }
    )
    .skip(limit)
    .limit(max);
  return permissions;
}
export async function GETPERMISSIONS(
  req: Request,
  res: Response
): Promise<Response> {
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
    const allPermissions: number = await modelsPermissionsUserADM.estimatedDocumentCount();
    if (allPermissions === 0) {
      return res
        .status(404)
        .json({ type: `ERROR`, message: "Not element in the DB" });
    }
    let permissions: IAdmPermissions[] | null = await PermissionsADMList(
      obLimitMax.limit,
      obLimitMax.max
    );
    return res.status(200).json({ permissions, allPermissions });
  } catch (error) {
    return res.status(500).json({
      type: `ERROR:`,
      message: error.message,
    });
  }
}
export async function GETPERMISSION(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const permission: IAdmPermissions | null = await PermissionsADMID(
      req.params.id
    );
    if (!permission) {
      return res.status(404).json({
        type: `ERROR`,
        message: "Not element in the DB",
      });
    }
    return res.status(200).json(permission);
  } catch (error) {
    return res.status(500).json({
      type: `ERROR`,
      message: error.message,
    });
  }
}
export async function ADDPERMISSION(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const newPermission = {
      name: req.body.name,
      active: req.body.active,
    };
    await new modelsPermissionsUserADM(newPermission).save();
    return res
      .status(201)
      .json({ type: "SUCCESS", message: "Successfully Create" });
  } catch (error) {
    return res.status(500).json({
      type: `ERROR:`,
      message: error.message,
    });
  }
}
export async function EDITPERMISSION(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const _id = req.body._id;
    const editPermission = {
      name: req.body.name,
      active: req.body.active,
    };
    const permission = await PermissionsADMID(_id);
    if (!permission) {
      return res.status(404).json({
        type: `ERROR`,
        message: "Not element in the DB",
      });
    }
    await permission.updateOne(editPermission, {
      runValidators: true,
      new: true,
    });
    return res
      .status(201)
      .json({ type: "SUCCESS", message: "Successfully Edit" });
  } catch (error) {
    return res.status(500).json({
      type: `ERROR:`,
      message: error.message,
    });
  }
}
export async function VALIDNAMEADD(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { name } = req.body;
    const permission: IAdmPermissions | null = await PermissionsADMName(name);
    if (permission) {
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
export async function VALIDNAMEEDIT(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { id, name } = req.body;
    const permission: IAdmPermissions | null = await PermissionsADMName(name);
    if (permission && permission._id != id) {
      return res.status(200).json(true);
    } else if (permission && permission?._id === id) {
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
export async function DELETEPERMISSION(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const ID: any = req.params.id;
    const permissions = await PermissionsADMID(ID);
    if (!permissions) {
      return res.status(404).json({
        type: `ERROR`,
        message: "No detect User in the DB",
      });
    }
    await permissions.deleteOne();
    return res
      .status(201)
      .json({ type: "SUCCESS", message: `Delete Successfully` });
  } catch (error) {
    return res.status(500).json({
      type: error.type,
      message: "ERROR SERVER",
    });
  }
}
export async function DELETEPERMISSIONS(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    let IDS: Array<any> = req.body.ids;
    for (const m of IDS) {
      const permissions = await PermissionsADMID(m);
      if (!permissions) {
        return res.status(404).json({
          type: `ERROR`,
          message: "No detect User in the DB",
        });
      }
      await permissions.deleteOne();
    }
    return res
      .status(201)
      .json({ type: "SUCCESS", message: `Delete Successfully` });
  } catch (error) {
    return res.status(500).json({
      type: error.type,
      message: "ERROR SERVER",
    });
  }
}
export async function SEARCH(req: Request, res: Response): Promise<Response> {
  try {
    let params = {
      name: req.query.name,
      active: req.query.active,
    };
    if (req.url.indexOf("?") === 0) {
      return res.status(399).json({
        type: "ERROR",
        message: "Invalid track in URL parameterm, Limit and Max is null",
      });
    }
    const limits = libValid.ValidPaginaton_Limit_Max(req);
    if (!limits) {
      return res.status(399).json({
        type: "ERROR",
        message: "Invalid track in URL parameterm, Limit and Max is null",
      });
    }
    let permissions: Array<IAdmPermissions> | null = await Search(
      limits.limit,
      limits.max,
      params
    );
    if (!permissions) {
      return res.status(403).json({
        type: `ERROR`,
        message: "Not element in the DB",
      });
    }
    let allPermissions = permissions.length;
    return res.status(199).json({ permissions, allPermissions });
  } catch (error) {
    return res.status(499).json({
      type: error.type,
      message: error.message,
    });
  }
}
