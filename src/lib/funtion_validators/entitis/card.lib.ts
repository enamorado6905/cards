import { Request, Response } from "express";
import { modelsCard, ICard } from "../../../models/models";
import { libValid, libValidPhotos } from "../../lib";

var namesPatterrn = /^([A-ZÁÉÍÓÚ]{1}[a-zñáéíóú]+[\s]*)+$/;

export function getExpNames(): RegExp {
  return namesPatterrn;
}

export async function CardID(ID: string): Promise<ICard | null> {
  return await modelsCard.findById(ID);
}
export async function CardIDForPhoto(ID: string): Promise<ICard | null> {
  return await modelsCard.findById(ID, {
    idimgData: 1,
  });
}
async function CardType(type: string): Promise<ICard | null> {
  await modelsCard.createIndexes([
    {
      type: 1,
    },
  ]);
  return await modelsCard.findOne({
    type: { $eq: type },
  });
}
export async function Search(
  limit: number,
  max: number,
  paramSearch: {
    type: any;
    description: any;
    price: any;
    allcard: any;
    active: any;
  }
): Promise<ICard[] | null> {
  await modelsCard.createIndexes([
    {
      type: 1,
    },
    {
      description: 1,
    },
    {
      price: 1,
    },
    {
      allcard: 1,
    },
    {
      active: 1,
    },
  ]);
  const card: Array<ICard> | null = await modelsCard
    .find({
      $or: [
        { title: { $eq: paramSearch.type } },
        { description: { $eq: paramSearch.description } },
        { price: { $eq: paramSearch.price } },
        { allcard: { $eq: paramSearch.allcard } },
        { active: { $eq: paramSearch.active } },
      ],
    })
    .skip(limit)
    .limit(max);
  return card;
}
async function CardList(
  limit: number,
  max: number
): Promise<Array<ICard> | null> {
  const cards: Array<ICard> | null = await modelsCard
    .find(
      {},
      {
        type: 1,
        price: 1,
        allCard: 1,
        idimgData: 1,
        createdAt: 1,
      }
    )
    .skip(limit)
    .limit(max);
  return cards;
}
export async function GETCARDS(req: Request, res: Response): Promise<Response> {
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
    let allCard: any, card: any;
    await Promise.all([
      (allCard = await modelsCard.estimatedDocumentCount()),
      (card = await CardList(obLimitMax.limit, obLimitMax.max)),
    ]);
    if (!allCard || !card) {
      return res.status(404).json({
        type: `ERROR`,
        message: "Not element in the DB",
      });
    }
    return res.status(200).json({ card, allCard });
  } catch (error) {
    return res.status(500).json({
      type: error.type,
      message: error.message,
    });
  }
}
export async function GETCARD(req: Request, res: Response): Promise<Response> {
  try {
    let card: ICard | null = await CardID(req.params.id);
    if (!card) {
      return res.status(404).json({
        type: `ERROR`,
        message: "Not element in the DB",
      });
    }
    return res.status(200).json(card);
  } catch (error) {
    return res.status(500).json({
      type: error.type,
      message: error.message,
    });
  }
}
export async function ADDCARD(req: Request, res: Response): Promise<Response> {
  try {
    const newCard = {
      type: req.body.type,
      price: req.body.price,
      description: req.body.description,
      allcard: req.body.allcard,
    };
    let card = new modelsCard(newCard);
    card.idimgData = await libValidPhotos.onADDPHOTOADD(
      card._id,
      req.file.buffer
    );
    await card.save();
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
export async function EDITCARD(req: Request, res: Response): Promise<Response> {
  try {
    const editCard = {
      _id: req.body._id,
      type: req.body.type,
      description: req.body.description,
      price: req.body.price,
      allcard: req.body.allcard,
    };
    let card: ICard | null = await CardID(editCard._id);
    if (!card) {
      return res.status(404).json({
        type: `ERROR`,
        message: "Not element in the DB",
      });
    }
    await card.updateOne(editCard, {
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
export async function VALIDTITLEADD(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { title } = req.body;
    const card: ICard | null = await CardType(title);
    if (card) {
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
    const { title } = req.body;
    const card: ICard | null = await CardType(title);
    if (card && card._id != id) {
      return res.status(200).json(true);
    } else if (card && card?._id === id) {
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
export async function DELETECARD(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    let entitis: Array<any> = req.body.ids;
    for (const m of entitis) {
      const card = await CardIDForPhoto(m);
      if (!card) {
        return res.status(404).json({
          type: `ERROR`,
          message: "No detect User in the DB",
        });
      }
      if (card.idimgData) {
        libValidPhotos.DeletePhoto(card.idimgData);
      }
      await card.deleteOne();
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
      type: req.query.type,
      description: req.query.description,
      price: req.query.price,
      allcard: req.query.allcard,
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
    let card: Array<ICard> | null = await Search(
      limits.limit,
      limits.max,
      params
    );
    if (!card) {
      return res.status(403).json({
        type: `ERROR`,
        message: "Not element in the DB",
      });
    }
    let allCard = card.length;
    return res.status(200).json({ card, allCard });
  } catch (error) {
    return res.status(500).json({
      type: error.type,
      message: error.message,
    });
  }
}
