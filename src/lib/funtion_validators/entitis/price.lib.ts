import { Request, Response } from "express";
import { modelsPrice, IPrice } from "../../../models/models";
import { libValid, libValidUser, libValidCard } from "../../lib";
const Stripe = require("stripe");
const stripe = Stripe(
  "sk_test_51J3NjsD1bGARjoEni0cJxO1JPGIJf8dEiIq9buhxn0U4C5kD40a0GG1TGQfb8CDqIZVRaR0YuSC0gsI33auE5eoT00hykuk1d1"
);

var namesPatterrn = /^([A-ZÁÉÍÓÚ]{1}[a-zñáéíóú]+[\s]*)+$/;

export function getExpNames(): RegExp {
  return namesPatterrn;
}
export async function PriceID(ID: string): Promise<IPrice | null> {
  return await modelsPrice.findById(ID);
}
export async function Search(
  limit: number,
  max: number,
  paramSearch: {
    price: any;
    active: any;
  }
): Promise<IPrice[] | null> {
  await modelsPrice.createIndexes([
    {
      price: 1,
    },
    {
      active: 1,
    },
  ]);
  const price: Array<IPrice> | null = await modelsPrice
    .find({
      $or: [
        { price: { $eq: paramSearch.price } },
        { active: { $eq: paramSearch.active } },
      ],
    })
    .skip(limit)
    .limit(max);
  return price;
}
async function PriceList(
  limit: number,
  max: number
): Promise<Array<IPrice> | null> {
  const prices: Array<IPrice> | null = await modelsPrice
    .find({})
    .skip(limit)
    .limit(max);
  return prices;
}
export async function GETPRICES(
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
    let allPrice: any, price: any;
    await Promise.all([
      (allPrice = await modelsPrice.estimatedDocumentCount()),
      (price = await PriceList(obLimitMax.limit, obLimitMax.max)),
    ]);
    if (!price) {
      return res.status(404).json({
        type: `ERROR`,
        message: "Not element in the DB",
      });
    }
    return res.status(200).json({ price, allPrice });
  } catch (error) {
    return res.status(500).json({
      type: error.type,
      message: error.message,
    });
  }
}
export async function GETPRICE(req: Request, res: Response): Promise<Response> {
  try {
    let price: IPrice | null = await PriceID(req.params.id);
    if (!price) {
      return res.status(404).json({
        type: `ERROR`,
        message: "Not element in the DB",
      });
    }
    return res.status(200).json(price);
  } catch (error) {
    return res.status(500).json({
      type: error.type,
      message: error.message,
    });
  }
}
export async function ADDPRICE(req: Request, res: Response): Promise<Response> {
  try {
    const newPrice = {
      day: Date.now(),
      price: req.body.price,
      user: req.body.user,
      card: req.body.card,
    };
    let user: any, card: any, payment: any;
    Promise.all([
      (user = await libValidUser.UserID(newPrice.user)),
      (card = await libValidCard.CardID(newPrice.card)),
    ]);
    if (!user || !card) {
      return res.status(400).json({
        type: "ERROR",
        message: "Wrong Date",
      });
    }
    stripe.paymentIntents.create({
      amount: parseInt(req.body.amount),
      currency: "usd",
      payment_method_types: ["card"],
      function(err: any, paymentIntent: any) {
        if (err) {
          res.status(500).json(err.message);
        }
      },
    });
    await new modelsPrice(newPrice).save();
    return res.status(201).json({
      type: "SUCCESS",
      message: "Successfully Create",
      infopay: payment,
    });
  } catch (error) {
    return res.status(400).json({
      type: error.type,
      message: error.message,
    });
  }
}
export async function EDITPRICE(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const editPrice = {
      _id: req.body._id,
      dayrenta: req.body.dayrenta,
      price: req.body.price,
      user: req.body.user,
      card: req.body.card,
      active: req.body.active,
    };
    let user: any, card: any, price: any;
    Promise.all([
      (user = await libValidUser.UserID(user)),
      (card = await libValidCard.CardID(card)),
      (price = await PriceID(editPrice._id)),
    ]);
    if (!user || !card) {
      return res.status(400).json({
        type: "ERROR",
        message: "Wrong Date",
      });
    }
    if (!price) {
      return res.status(404).json({
        type: `ERROR`,
        message: "Not element in the DB",
      });
    }
    await price.updateOne(editPrice, {
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
export async function DELETEPRICE(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    let IDS: Array<any> = req.body.ids;
    for (const m of IDS) {
      const price = await PriceID(m);
      if (!price) {
        return res.status(404).json({
          type: `ERROR`,
          message: "No detect User in the DB",
        });
      }
      await price.deleteOne();
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
    let price: Array<IPrice> | null = await Search(
      limits.limit,
      limits.max,
      params
    );
    if (!price) {
      return res.status(403).json({
        type: `ERROR`,
        message: "Not element in the DB",
      });
    }
    let allPrice = price.length;
    return res.status(199).json({ price, allPrice });
  } catch (error) {
    return res.status(499).json({
      type: error.type,
      message: error.message,
    });
  }
}
