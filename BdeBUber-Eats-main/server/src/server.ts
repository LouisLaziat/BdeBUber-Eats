//#region Imports
import express from "express";
import { Request, Response, NextFunction } from "express";
import path from "path";
import ejs, { name } from "ejs";
import bodyParser, { json } from "body-parser";
import { loadMap } from "./fetchRestoData";
import { receiveInsREQ } from "./inscriptionBD";
import { MapData, MenuPage, UserFormData, PaymentData } from "./misc";
import { checkValidConnection, connectToMongo } from "./connexionBD";
import { verifyAdminPassword } from "./adminConnectionBD";
import { receiveAddRestoREQ } from "./adminResto";
import { addMenuToDB, fetchAllItemNames, fetchMenuNames } from "./adminMenu";
import logger from "./winstonconfig";
import { receivePaymentREQ } from "./paiement";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import { insererItem } from "./adminItem";
import { buildMenu } from "./fetchMenuData";
import { fetchSearchQuery } from "./fetchSearchQuery";
import { envoyerLeCourriel } from "./envoyerCourriel";
//#endregion

const port: number = 3000;
const app = express();
config();
let mapData: MapData[] = [];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use((req, res, next) => {
  if (req.url != "/public/icons/icon.ico") {
    logger.info("Received request:" + req.url);
  }
  next();
});

app.set("view-engine", "ejs");
app.engine("ejs", ejs.renderFile);
app.set("views", path.join(__dirname, "..", "..", "views"));

app.get("/", (req, res) => {
  if (req.cookies.auth === "true") {
    res.redirect("/map");
  } else {
    const pathToIndex: string = path.join(
      __dirname,
      "..",
      "..",
      "views",
      "pages",
      "index.ejs"
    );
    ejs.renderFile(pathToIndex, {}, {}, (err, template) => {
      if (err) {
        throw err;
      } else {
        res.end(template);
      }
    });
  }
});

app.get("/admin", requireCookie, requireAdminCookie, (req, res) => {
  const pathToAdmin: string = path.join(
    __dirname,
    "..",
    "..",
    "views",
    "pages",
    "admin.ejs"
  );
  ejs.renderFile(pathToAdmin, {}, {}, (err, template) => {
    if (err) {
      throw err;
    } else {
      res.end(template);
    }
  });
});

app.get("/map", requireCookie, async (req, res) => {
  try {
    mapData = await loadMap();
    logger.info(`Rendering map...`);
    let pathToMap = path.join(
      __dirname,
      "..",
      "..",
      "views",
      "pages",
      "map.ejs"
    );
    ejs.renderFile(pathToMap, { mapData }, {}, (err, template) => {
      if (err) {
        throw err;
      } else {
        res.end(template);
      }
    });
  } catch (err: any) {
    logger.error("Error! 💀 " + err.message);
  }
});

app.get("/connexion", (req, res) => {
  if (req.cookies.auth === "true") {
    res.redirect("/map");
  } else {
    const pathToConnexion: string = path.join(
      __dirname,
      "..",
      "..",
      "views",
      "pages",
      "connexion.ejs"
    );
    ejs.renderFile(pathToConnexion, {}, {}, (err, template) => {
      if (err) {
        throw err;
      } else {
        res.end(template);
      }
    });
  }
});

app.get("/paiement", requireCookie, async (req, res) => {
  try {
    const pathToPaiement = path.join(
      __dirname,
      "..",
      "..",
      "views",
      "pages",
      "paiement.ejs"
    );
    ejs.renderFile(pathToPaiement, {}, {}, (err, template) => {
      if (err) {
        throw err;
      } else {
        res.end(template);
      }
    });
  } catch (error: any) {
    logger.error("Error! 💀 " + error.message);
  }
});

app.get("/ajouterItem", requireCookie, requireAdminCookie, (req, res) => {
  const pathToConnexion: string = path.join(
    __dirname,
    "..",
    "..",
    "views",
    "pages",
    "ajout-item.ejs"
  );
  ejs.renderFile(pathToConnexion, {}, {}, (err, template) => {
    if (err) {
      throw err;
    } else {
      res.end(template);
    }
  });
});

app.get("/remerciement/:num_com", requireCookie, (req, res) => {
  const pathToRemerciement: string = path.join(
    __dirname,
    "..",
    "..",
    "views",
    "pages",
    "remerciement.ejs"
  );
  const numeroCommande = req.params.num_com;
  ejs.renderFile(
    pathToRemerciement,
    { numeroCommande },
    {},
    (err, template) => {
      if (err) {
        throw err;
      } else {
        res.send(template);
      }
    }
  );
});

app.get("/ajouterMenu", requireAdminCookie, requireCookie, (req, res) => {
  const pathToAjoutMenu: string = path.join(
    __dirname,
    "..",
    "..",
    "views",
    "pages",
    "ajouterMenu.ejs"
  );
  ejs.renderFile(pathToAjoutMenu, {}, {}, (err, template) => {
    if (err) {
      throw err;
    } else {
      res.end(template);
    }
  });
});

app.get("/ajouterRestaurant", requireAdminCookie, requireCookie, (req, res) => {
  const pathToRestoAdmin: string = path.join(
    __dirname,
    "..",
    "..",
    "views",
    "pages",
    "ajouterRestaurant.ejs"
  );
  ejs.renderFile(pathToRestoAdmin, {}, {}, (err, template) => {
    if (err) {
      throw err;
    } else {
      res.end(template);
    }
  });
});

app.get("/public/*", (req, res) => {
  let pathToFile = path.join(
    __dirname,
    "..",
    "..",
    "public",
    req.url.split("/public/")[1]
  );

  res.sendFile(pathToFile);
});

app.get("/inscription", (req, res) => {
  if (req.cookies.auth === "true") {
    res.redirect("/map");
  } else {
    const pathToInscription: string = path.join(
      __dirname,
      "..",
      "..",
      "views",
      "pages",
      "inscription.ejs"
    );
    ejs.renderFile(pathToInscription, {}, {}, (err: any, template) => {
      if (err) {
        throw err;
      } else {
        res.end(template);
      }
    });
  }
});

app.get("/ajouterItem", requireCookie, (req, res) => {
  const pathToAjoutItem: string = path.join(
    __dirname,
    "..",
    "..",
    "views",
    "pages",
    "ajout-item.ejs"
  );
  ejs.renderFile(pathToAjoutItem, {}, {}, (err, template) => {
    if (err) {
      throw err;
    } else {
      res.send(template);
    }
  });
});

app.post("/inscription-form", async (req, res) => {
  const formData = req.body;
  const success: boolean = await receiveInsREQ(formData);
  if (success) {
    res.send(JSON.stringify({ granted: true }));
  } else {
    res.send(
      JSON.stringify({
        granted: false,
        message:
          " \n Erreur lors de l'inscription. \n Vérifiez vos informations et réessayez.",
      })
    );
  }
});

app.post("/addMenuDB", requireCookie, async (req, res) => {
  const body = req.body;
  //MenuName: string ,  MenuDescription: string , MenuItems:string[] , MenuRestaurant:string
  const MenuName: string = body.menuName;
  const MenuDescription: string = body.menuDesc;
  const MenuRestaurant: string = body.menuRestaurant;
  const MenuItems: string[] = Object.values(body.radioItems);

  addMenuToDB(MenuName, MenuDescription, MenuItems, MenuRestaurant);
});

app.post("/fetchAllItems", async (req, res) => {
  const names = await fetchAllItemNames();
  const response = JSON.stringify(names);

  res.send(response);
});

app.post("/ajouter_item", async (req, res) => {
  const formData = req.body;
  await insererItem(formData);
  res.send("Item Ajouté avec succès!");
});
app.post("/fetchAdminData", async (req, res) => {
  const { userPrename, input } = req.body;
  if (await verifyAdminPassword(input, userPrename)) {
    res.cookie("admin", "true");
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});
app.post("/ajouter_resto", async (req, res) => {
  const formData = req.body;
  receiveAddRestoREQ(formData);
});

app.post("/getMenuOptions", async (req, res) => {
  const names = await fetchMenuNames();
  res.send(names);
});

app.post("/payer", async (req, res) => {
  const data = req.body;
  console.log(data);
  const num_com: string = await receivePaymentREQ(data);
  res.redirect(`remerciement/${num_com}`);
});

app.post("/fetchAdminData", async (req, res) => {
  const { userPrename, input } = req.body;
  if (await verifyAdminPassword(input, userPrename)) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});
app.post("/ajouter_resto", async (req, res) => {
  const formData = req.body;
  receiveAddRestoREQ(formData);
});

app.post("/getMenuOptions", async (req, res) => {
  const names = await fetchMenuNames();
  res.send(names);
});

app.post("/connexion", async (req, res) => {
  const { email, password } = req.body;
  const validConnexion: UserFormData | null = await checkValidConnection(
    email,
    password
  );
  if (validConnexion) {
    logger.info("Connexion success");
    res.cookie("auth", "true");
    res.send(
      JSON.stringify({
        granted: true,
        name: validConnexion.name,
        prename: validConnexion.prename,
        email: validConnexion.email,
        address: validConnexion.address,
        country: validConnexion.country,
      })
    );
  } else {
    logger.info("Connexion fail");
    res.send(JSON.stringify({ granted: false }));
  }
});

app.post("/disconnect", (req, res) => {
  res.clearCookie("auth");
  res.clearCookie("admin");
  res.send(JSON.stringify({ disconnected: true }));
});

app.post("/envoyer-email", (req, res) => {
  //Réception des données
  const formData = req.body;
  res.send(
    envoyerLeCourriel(
      formData.infosUtilisateur,
      formData.panier,
      formData.numeroDeCommande
    )
  );
});

function requireCookie(req: Request, res: Response, next: NextFunction) {
  if (req.cookies.auth === "true") {
    next();
  } else {
    res.redirect("/connexion");
  }
}

function requireAdminCookie(req: Request, res: Response, next: NextFunction) {
  if (req.cookies.admin === "true") {
    next();
  } else {
    res.redirect("/map");
  }
}

app.get("/menu/*", requireCookie, async (req, res) => {
  try {
    const designated = decodeURIComponent(req.url.split("/")[2]);
    const restaurant: MenuPage | null = await buildMenu(designated);
    const pathToMenu = path.join(
      __dirname,
      "..",
      "..",
      "views",
      "pages",
      "menu.ejs"
    );
    ejs.renderFile(pathToMenu, { restaurant }, {}, (err, template) => {
      if (err) {
        throw err;
      } else {
        res.end(template);
      }
    });
  } catch (error: any) {
    logger.error("Error! 💀 " + error.message);
  }
});

app.post("/mapRequest", async (req, res) => {
  if (mapData.length === 0) {
    mapData = await loadMap();
  }
  const query = req.body.query;
  const newMarkers: MapData[] | null = await fetchSearchQuery(
    query,
    await connectToMongo(process.env.DB_URI),
    mapData
  );
  res.send(JSON.stringify(newMarkers));
});

app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});
