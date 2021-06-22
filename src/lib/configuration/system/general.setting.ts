import * as models from "../../../models/models";

export async function FuntionControlAddEntitis(): Promise<void> {
  if ((await models.modelsRol.estimatedDocumentCount()) === 0)
    await createRolADM();
  if ((await models.modelsUserADM.estimatedDocumentCount()) === 0)
    await createADM();
  return;
}
async function createRolADM(): Promise<void> {
  try {
    await Promise.all([
      new models.modelsRol({ name: "USER" }).save(),
      new models.modelsRol({ name: "ADM" }).save(),
    ]);
    return;
  } catch (error) {
    throw new Error(error);
  }
}
async function createADM(): Promise<void> {
  try {
    const rol: models.IRol | null = await models.modelsRol.findOne({
      name: "ADM",
    });
    let user: models.IUserADM = new models.modelsUserADM({
      name: process.env.NAME_ADM ? process.env.NAME_ADM : "",
      nametwo: process.env.NAMETWO_ADM ? process.env.NAMETWO_ADM : "",
      lastnameone: process.env.LASNAME0NE_ADM ? process.env.LASNAME0NE_ADM : "",
      lastnametwo: process.env.LASNAMETWO_ADM ? process.env.LASNAMETWO_ADM : "",
      email: process.env.EMAIL_ADM ? process.env.EMAIL_ADM : "",
      rol: rol?._id,
      user: process.env.USER_ADM ? process.env.USER_ADM : "",
      password: process.env.PASSWORD_ADM,
      active: true,
    });
    await user.save();
    return;
  } catch (error) {
    throw new Error(error);
  }
}
