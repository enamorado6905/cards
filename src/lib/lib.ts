//SERVER
import * as libGeneral from "./configuration/system/general.setting";

//ENTITIS
import * as libValidUserADM from "./funtion_validators/entitis/userAdm.lib";
import * as libValidUser from "./funtion_validators/entitis/user.lib";
import * as libValidCard from "./funtion_validators/entitis/card.lib";
import * as libValidPrice from "./funtion_validators/entitis/price.lib";
import * as libValidRental from "./funtion_validators/entitis/rental.lib";
import * as libValidDayRental from "./funtion_validators/entitis/dayrental.lib";

//PERMISSION & ROL
import * as libValidRol from "./funtion_validators/rol_permissions/rol.lib";

//VALID
import * as libValid from "./funtion_validators/validetors.lib";

//PHOTO
import * as libValidPhotos from "./funtion_validators/photo/photo.lib";

export {
  libGeneral,
  libValidUserADM,
  libValidRol,
  libValid,
  libValidPhotos,
  libValidCard,
  libValidUser,
  libValidDayRental,
  libValidRental,
  libValidPrice,
};
