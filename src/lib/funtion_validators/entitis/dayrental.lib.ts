import { Request, Response } from "express";
import { modelsDayRental, IDayRental } from "../../../models/models";
import { libValid } from "../../lib";

var namesPatterrn = /^([A-ZÁÉÍÓÚ]{1}[a-zñáéíóú]+[\s]*)+$/;

export function getExpNames(): RegExp {
  return namesPatterrn;
}

export async function DayRentalID(ID: string): Promise<IDayRental | null> {
  return await modelsDayRental.findById(ID);
}
async function DayRentalDescrition(
  description: string
): Promise<IDayRental | null> {
  await modelsDayRental.createIndexes([
    {
      description: 1,
    },
  ]);
  return await modelsDayRental.findOne({
    description: { $eq: description },
  });
}
export async function Search(
  limit: number,
  max: number,
  paramSearch: {
    description: any;
    dayrental: any;
    price: any;
    active: any;
  }
): Promise<IDayRental[] | null> {
  await modelsDayRental.createIndexes([
    {
      description: 1,
    },
    {
      dayrental: 1,
    },
    {
      price: 1,
    },
    {
      active: 1,
    },
  ]);
  const dayrental: Array<IDayRental> | null = await modelsDayRental
    .find({
      $or: [
        { description: { $eq: paramSearch.description } },
        { dayrental: { $eq: paramSearch.dayrental } },
        { price: { $eq: paramSearch.price } },
        { active: { $eq: paramSearch.active } },
      ],
    })
    .skip(limit)
    .limit(max);
  return dayrental;
}
async function DayRentalList(
  limit: number,
  max: number
): Promise<Array<IDayRental> | null> {
  const dayrentals: Array<IDayRental> | null = await modelsDayRental
    .find(
      {},
      {
        description: 1,
        dayrental: 1,
        price: 1,
        active: 1,
      }
    )
    .skip(limit)
    .limit(max);
  return dayrentals;
}
export async function GETDAYRENTALS(
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
    let allDayRental: any, dayrental: any;
    await Promise.all([
      (allDayRental = await modelsDayRental.estimatedDocumentCount()),
      (dayrental = await DayRentalList(obLimitMax.limit, obLimitMax.max)),
    ]);
    if (!dayrental) {
      return res.status(404).json({
        type: `ERROR`,
        message: "Not element in the DB",
      });
    }
    return res.status(200).json({ dayrental, allDayRental });
  } catch (error) {
    return res.status(500).json({
      type: error.type,
      message: error.message,
    });
  }
}
export async function GETDAYRENTAL(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    let dayrental: IDayRental | null = await DayRentalID(req.params.id);
    if (!dayrental) {
      return res.status(404).json({
        type: `ERROR`,
        message: "Not element in the DB",
      });
    }
    return res.status(200).json(dayrental);
  } catch (error) {
    return res.status(500).json({
      type: error.type,
      message: error.message,
    });
  }
}
export async function ADDDAYRENTAL(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const newDayRental = {
      description: req.body.description,
      dayrental: req.body.dayrental,
      price: req.body.price,
      active: req.body.active,
    };
    await new modelsDayRental(newDayRental).save();
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
export async function EDITDAYRENTAL(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const editDayRental = {
      _id: req.body._id,
      description: req.body.description,
      dayrental: req.body.dayrental,
      price: req.body.price,
      active: req.body.active,
    };
    let dayrental: IDayRental | null = await DayRentalID(editDayRental._id);
    if (!dayrental) {
      return res.status(404).json({
        type: `ERROR`,
        message: "Not element in the DB",
      });
    }
    await dayrental.updateOne(editDayRental, {
      runValidators: true,
    });
    return res
      .status(201)
      .json({ type: "SUCCESS", message: "Update Successfully" });
  } catch (error) {
    return res.status(400).json({
      type: error.type,
      message: error.message,
    });
  }
}
export async function VALIDDESCRIPTIONADD(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { description } = req.body;
    const dayrental: IDayRental | null = await DayRentalDescrition(description);
    if (dayrental) {
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
export async function VALIDTITLEEDIT(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const dayrental: IDayRental | null = await DayRentalDescrition(description);
    if (dayrental && dayrental._id != id) {
      return res.status(200).json(true);
    } else if (dayrental && dayrental?._id === id) {
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
export async function DELETEDAYRENTAL(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    let entitis: Array<any> = req.body.ids;
    for (const m of entitis) {
      const dayrental = await DayRentalID(m);
      if (!dayrental) {
        return res.status(404).json({
          type: `ERROR`,
          message: "No detect User in the DB",
        });
      }
      await dayrental.deleteOne();
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
      description: req.query.description,
      dayrental: req.query.dayrental,
      price: req.query.price,
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
    let dayrental: Array<IDayRental> | null = await Search(
      limits.limit,
      limits.max,
      params
    );
    if (!dayrental) {
      return res.status(403).json({
        type: `ERROR`,
        message: "Not element in the DB",
      });
    }
    let allDayRental = dayrental.length;
    return res.status(200).json({ dayrental, allDayRental });
  } catch (error) {
    return res.status(500).json({
      type: error.type,
      message: error.message,
    });
  }
}
