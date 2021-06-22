import * as routerRol from "./rols/rol.router";
import * as routerphotos from "./photos/photos.router";
import * as routerAuth from "./authentication/authentication.routes";

//ENTITIS
import * as routerUserADM from "./entitis/userAdm.routes";
import * as routerUser from "./entitis/user.router";
import * as routerCard from "./entitis/card.router";
import * as routerPrice from "./entitis/price.router";
import * as routerRental from "./entitis/rental.router";
import * as routerDayRental from "./entitis/dayretal.router";

export {
  routerRol,
  routerAuth,
  routerphotos,
  routerDayRental,
  routerRental,
  routerPrice,
  routerCard,
  routerUserADM,
  routerUser,
};
