import * as controRol from "./rols/rol.controllers";
import * as controPhotos from "./photos/photos.controllers";
import * as auth from "./authentication/authentication.controllers";

//ENTITIS
import * as controUserADM from "./Entities/userAdm.controllers";
import * as controUser from "./Entities/user.controlles";
import * as controCard from "./Entities/card.controllers";
import * as controPrice from "./Entities/price.controllers";
import * as controRental from "./Entities/rental.controlles";
import * as controDayRental from "./Entities/dayrental.controllers";

export {
  controUserADM,
  controCard,
  controRental,
  controUser,
  controDayRental,
  controPrice,
  controRol,
  controPhotos,
  auth,
};
