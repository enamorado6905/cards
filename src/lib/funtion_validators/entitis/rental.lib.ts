import { Request, Response } from "express";
import { modelsRental, IRental } from "../../../models/models";
import { libValid, libValidUser, libValidCard } from "../../lib";

var namesPatterrn = /^([A-ZÁÉÍÓÚ]{1}[a-zñáéíóú]+[\s]*)+$/;

export function getExpNames(): RegExp {
  return namesPatterrn;
}

export async function RentalID(ID: string): Promise<IRental | null> {
  return await modelsRental.findById(ID);
}
export async function Search(
  limit: number,
  max: number,
  paramSearch: {
    dayrental: any;
    daytoprental: any;
    price: any;
    active: any;
  }
): Promise<IRental[] | null> {
  await modelsRental.createIndexes([
    {
      dayrental: 1,
    },
    {
      daytoprenta: 1,
    },
    {
      price: 1,
    },
    {
      active: 1,
    },
  ]);
  const rental: Array<IRental> | null = await modelsRental
    .find({
      $or: [
        { dayrental: { $eq: paramSearch.dayrental } },
        { daytoprental: { $eq: paramSearch.daytoprental } },
        { price: { $eq: paramSearch.price } },
        { active: { $eq: paramSearch.active } },
      ],
    })
    .skip(limit)
    .limit(max);
  return rental;
}
async function RentalList(
  limit: number,
  max: number
): Promise<Array<IRental> | null> {
  const rentals: Array<IRental> | null = await modelsRental
    .find(
      {},
      {
        description: 1,
        rental: 1,
        price: 1,
        active: 1,
      }
    )
    .skip(limit)
    .limit(max);
  return rentals;
}
export async function GETRENTALS(
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
    const allDayRental: number = await modelsRental.estimatedDocumentCount();
    let rental: Array<IRental> | null;
    if (allDayRental === 0) {
      return res.status(404);
    }
    rental = await RentalList(obLimitMax.limit, obLimitMax.max);
    if (!rental) {
      return res.status(404).json({
        type: `ERROR`,
        message: "Not element in the DB",
      });
    }
    return res.status(200).json({ rental, allDayRental });
  } catch (error) {
    return res.status(500).json({
      type: error.type,
      message: error.message,
    });
  }
}
export async function GETRENTAL(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    let rental: IRental | null = await RentalID(req.params.id);
    if (!rental) {
      return res.status(404).json({
        type: `ERROR`,
        message: "Not element in the DB",
      });
    }
    return res.status(200).json(rental);
  } catch (error) {
    return res.status(500).json({
      type: error.type,
      message: error.message,
    });
  }
}
export async function ADDRENTAL(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const newRental = {
      dayrental: req.body.dayrental,
      daytoprental: req.body.daytoprental,
      price: req.body.price,
      user: req.body.user,
      card: req.body.card,
      active: req.body.active,
    };
    let user_: any, card_: any;
    await Promise.all([
      (card_ = await libValidCard.CardID(newRental.card)),
      (user_ = await libValidUser.UserID(newRental.user)),
    ]);
    if (!card_ || !user_) {
      return res.status(404).json({
        type: `ERROR`,
        message: "User or card not element in the DB",
      });
    }
    await new modelsRental(newRental).save();
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
export async function EDITRENTAL(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const editRental = {
      _id: req.body._id,
      dayrental: req.body.dayrental,
      daytoprental: req.body.daytoprental,
      price: req.body.price,
      user: req.body.user,
      card: req.body.card,
      active: req.body.active,
    };
    let user_: any, card_: any;
    await Promise.all([
      (card_ = await libValidCard.CardID(editRental.card)),
      (user_ = await libValidUser.UserID(editRental.user)),
    ]);
    if (!card_ || !user_) {
      return res.status(404).json({
        type: `ERROR`,
        message: "User or card not element in the DB",
      });
    }
    let rental: IRental | null = await RentalID(editRental._id);
    if (!rental) {
      return res.status(404).json({
        type: `ERROR`,
        message: "Not element in the DB",
      });
    }
    await rental.updateOne(editRental, {
      runValidators: true,
      new: true,
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
export async function DELETERENTAL(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    let ID = req.body.id;
    const rental = await RentalID(ID);
    if (!rental) {
      return res.status(404).json({
        type: `ERROR`,
        message: "No detect User in the DB",
      });
    }
    await rental.deleteOne();
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
export async function DELETERENTALS(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    let IDS: Array<any> = req.body.ids;
    if (!IDS || IDS.length === 0) {
      return res.status(404).json({
        type: `ERROR`,
        message: "Not element in the DB",
      });
    }
    for (const m of IDS) {
      const rental = await RentalID(m);
      if (!rental) {
        return res.status(404).json({
          type: `ERROR`,
          message: "No detect User in the DB",
        });
      }
      await rental.deleteOne();
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
      dayrental: req.query.dayrental,
      daytoprental: req.query.daytoprental,
      price: req.query.price,
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
    let rental: Array<IRental> | null = await Search(
      limits.limit,
      limits.max,
      params
    );
    if (!rental) {
      return res.status(403).json({
        type: `ERROR`,
        message: "Not element in the DB",
      });
    }
    let allDayRental = rental.length;
    return res.status(199).json({ rental, allDayRental });
  } catch (error) {
    return res.status(499).json({
      type: error.type,
      message: error.message,
    });
  }
}
