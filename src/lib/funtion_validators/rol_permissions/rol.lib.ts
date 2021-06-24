import { Request, Response } from "express";
import { modelsRol, IRol } from "../../../models/models";
import { libValid } from "../../lib";

var namesPatterrn = /^([A-ZÁÉÍÓÚ]{1}[a-zñáéíóú]+[\s]*)+$/;

export function getExpNames(): RegExp {
  return namesPatterrn;
}
export async function RolID(ID: string): Promise<IRol | null> {
  const rol: IRol | null = await modelsRol.findById(ID);
  return rol;
}
export async function RolNAME(name: string): Promise<IRol | null> {
  await modelsRol.createIndexes([
    {
      name: 1,
    },
  ]);
  const rol: IRol | null = await modelsRol.findOne({
    name: { $eq: name },
  });
  return rol;
}
export async function Search(
  limit: number,
  max: number,
  paramSearch: {
    name: any;
    active: any;
  }
): Promise<IRol[] | null> {
  await modelsRol.createIndexes([
    {
      name: 1,
    },
    {
      active: 1,
    },
  ]);
  const rol: IRol[] | null = await modelsRol
    .find({
      $or: [
        { name: { $regex: `${paramSearch.name}`, $options: "i" } },
        { active: paramSearch.active },
      ],
    })
    .skip(limit)
    .limit(max);
  return rol;
}
export async function RolADMList(
  limit: number,
  max: number
): Promise<Array<IRol> | null> {
  const rolADM: Array<IRol> | null = await modelsRol
    .find(
      {},
      {
        name: 1,
        active: 1,
      }
    )
    .skip(limit)
    .limit(max);
  return rolADM;
}
export async function GETROLSADDUSER(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const rolADM: Array<IRol> | null = await modelsRol.find(
      {},
      {
        name: 1,
        active: 1,
      }
    );
    if (!rolADM || rolADM.length === 0) {
      return res
        .status(404)
        .json({ type: `ERROR`, message: "Not element in the DB" });
    }
    return res.status(200).json(rolADM);
  } catch (error) {
    return res.status(500).json({
      type: `ERROR:`,
      message: error.message,
    });
  }
}
export async function GETROLS(req: Request, res: Response): Promise<Response> {
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
    const allRol: number = await modelsRol.estimatedDocumentCount();
    if (allRol === 0) {
      return res
        .status(404)
        .json({ type: `ERROR`, message: "Not element in the DB" });
    }
    let rolADM: IRol[] | null = await RolADMList(
      obLimitMax.limit,
      obLimitMax.max
    );
    return res.status(200).json({ rolADM, allRol });
  } catch (error) {
    return res.status(500).json({
      type: `ERROR:`,
      message: error.message,
    });
  }
}
export async function GETROL(req: Request, res: Response): Promise<Response> {
  try {
    const RolADM: IRol | null = await RolID(req.params.id);
    if (!RolADM) {
      return res.status(404).json({
        type: `ERROR`,
        message: "Not element in the DB",
      });
    }
    return res.status(200).json(RolADM);
  } catch (error) {
    return res.status(500).json({
      type: `ERROR`,
      message: error.message,
    });
  }
}
export async function ADDROL(req: Request, res: Response): Promise<Response> {
  try {
    const newRoll = {
      name: req.body.name,
      idPermissions: req.body.idPermissions,
      active: req.body.active,
    };
    const addRoll = new modelsRol(newRoll);
    await addRoll.save();
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
export async function EDITROL(req: Request, res: Response): Promise<Response> {
  try {
    const _id = req.body._id;
    const editRoll = {
      name: req.body.name,
      idPermissions: req.body.idPermissions,
      active: req.body.active,
    };
    const rol = await RolID(_id);
    if (!rol) {
      return res.status(404).json({
        type: `ERROR`,
        message: "Not element in the DB",
      });
    }
    await rol.updateOne(editRoll, {
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
    const rol: IRol | null = await RolNAME(name);
    if (rol) {
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
export async function VALIDNAMEEDIT(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { id, name } = req.body;
    const rol: IRol | null = await RolNAME(name);
    if (rol && rol._id != id) {
      return res.status(200).json(true);
    } else if (rol && rol?._id === id) {
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
export async function DELETEROL(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const IDS: Array<any> = req.body.ids;
    for (const m of IDS) {
      const rol = await RolID(m);
      if (!rol) {
        return res.status(404).json({
          type: `ERROR`,
          message: "No detect User in the DB",
        });
      }
      await rol.deleteOne();
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
      active: req.query.active,
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
    let rol: Array<IRol> | null = await Search(
      limits.limit,
      limits.max,
      params
    );
    if (!rol) {
      return res.status(403).json({
        type: `ERROR`,
        message: "Not element in the DB",
      });
    }
    let allRol = rol.length;
    return res.status(200).json({ rol, allRol });
  } catch (error) {
    return res.status(500).json({
      type: error.name,
      message: error.message,
    });
  }
}
