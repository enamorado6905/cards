import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
const app = express();

/* ===================================== Import Validators ================================ */
import * as setting from "./lib/configuration/system/general.setting";
import { middValidToken } from "./middlewares/middlewares";
/* ===================================== Import Validators =================================*/

/* ===================================Import Router AUTH =================================== */
import {
  routerRol,
  routerAuth,
  routerphotos,
  routerDayRental,
  routerRental,
  routerPrice,
  routerCard,
  routerUserADM,
  routerUser,
} from "./routes/router";
/* ===================================Import Router AUTH =================================== */

/* ====================================== Setting ========================================= */
app.set("port", process.env.PORT ? process.env.PORT : "");
/* ====================================== Setting ========================================= */

/* ======================================= Middelewares =================================== */
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
setting.FuntionControlAddEntitis();
app.use("/api/", middValidToken.token_validators_ADM);
/* ======================================= Middelewares =================================== */

/* ================================= Router ADM =========================================== */
app.use("/api/ADM", routerUserADM.default);
app.use("/api/USER", routerUser.default);
app.use("/api/CARD", routerCard.default);
app.use("/api/DAYRENTAL", routerDayRental.default);
app.use("/api/RENTAL", routerRental.default);
app.use("/api/PRICE", routerPrice.default);

/* ================================= Router ADM =========================================== */

/* ============================= Router Rol and PER ======================================= */
app.use("/api/ROL", routerRol.default);
/* ============================= Router Rol and PER ======================================= */

/* ================================= Router PHOTO =========================================== */
app.use("/imagen", routerphotos.default);
/* ================================= Router PHOTO =========================================== */

/* ================================ Router Authentication ================================= */
app.use("/auth", routerAuth.default);
/* ================================ Router Authentication ================================= */
/* ===== this folders for this application will be used to store public file images ======= */
app.use("/photo", express.static(path.resolve("photo")));
/* ==== this folders for this application will be used to store public file images ======== */

export default app;
