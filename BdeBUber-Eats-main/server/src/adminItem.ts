import { connectToMongo } from "./connexionBD";
import { MongoClient, Collection, Db, ClientSession } from "mongodb";
import { ItemFormData } from "./misc";
import logger from "./winstonconfig";

let nom_item_obtenu_du_formulaire: string;
let description_item_obtenu_du_formulaire: string;
let prix_item_obtenu_du_formulaire: string;
let quantite_item_obtenu_du_formulaire: string;

export async function insererItem(formData: FormData | { [key: string]: any }) {
  const URI = process.env.DB_URI;
  let form = new FormData();
  if (!(formData instanceof FormData)) {
    for (const key in formData) {
      form.append(key, formData[key]);
    }
  } else form = formData;
  let client: MongoClient = await connectToMongo(URI);
  const database = client.db("bdebuber");
  const collection: Collection<ItemFormData> = database.collection("item");

  chargerLesVariablesDesItems(form);
  formaterLeTexteDuNomDeLitemEtDeSaDescription();
  formaterLeTexteDeLaDescriptionDeLitem();

  const critreDeRechercheNomItem = { item_name: nom_item_obtenu_du_formulaire };

  //Vérifier si l'item existe déjà
  let itemCount = await collection.countDocuments(critreDeRechercheNomItem);

  //Si l'item n'existe pas dans la collection
  if (itemCount === 0) {
    logger.info("Cet item n'existe pas encore dans la base de données.");
    const item: ItemFormData = {
      item_name: nom_item_obtenu_du_formulaire,
      item_description: description_item_obtenu_du_formulaire,
      item_price: prix_item_obtenu_du_formulaire,
      item_quantity: quantite_item_obtenu_du_formulaire,
    };

    try {
      await collection.insertOne(item);
      logger.info("Item inséré avec succès");
    } catch (err) {
      console.error(err);
    }
  } else {
    //Si l'item existe déjà dans la collection
    logger.info("L'item existe déjà!");
    await mettreAjourLaQuantiteDeLitemDejaExistantDansLaBd(collection);
    await mettreAjourLePrixDeLitemDejaExistantDansLaBd(collection);
  }
  client.close;
}

function chargerLesVariablesDesItems(form: FormData) {
  nom_item_obtenu_du_formulaire = form.get("item_name")?.toString() || "";
  description_item_obtenu_du_formulaire =
    form.get("description_item")?.toString() || "";
  prix_item_obtenu_du_formulaire = form.get("prix_item")?.toString() || "";
  quantite_item_obtenu_du_formulaire =
    form.get("quantite_item")?.toString() || "";
}

function formaterLeTexteDuNomDeLitemEtDeSaDescription() {
  nom_item_obtenu_du_formulaire =
    nom_item_obtenu_du_formulaire.charAt(0).toUpperCase() +
    nom_item_obtenu_du_formulaire.slice(1);
}
function formaterLeTexteDeLaDescriptionDeLitem() {
  description_item_obtenu_du_formulaire =
    description_item_obtenu_du_formulaire.charAt(0).toUpperCase() +
    description_item_obtenu_du_formulaire.slice(1);
}
async function mettreAjourLaQuantiteDeLitemDejaExistantDansLaBd(
  collection: Collection<ItemFormData>
) {
  //Chercher l'item dans la base de données
  const item = await collection.findOne({
    item_name: nom_item_obtenu_du_formulaire,
  });

  //Si l'item est trouvé
  if (item) {
    const nouvelleQuantite =
      parseInt(item.item_quantity) +
      parseInt(quantite_item_obtenu_du_formulaire);
    await collection.updateOne(
      { item_name: nom_item_obtenu_du_formulaire },
      { $set: { item_quantity: nouvelleQuantite.toString() } }
    );
    logger.info("La quantité de l'item a été mis à jour avec succès!");
  } else {
    logger.error("L'item n'est pas trouvé dans la base de données.");
  }
}
async function mettreAjourLePrixDeLitemDejaExistantDansLaBd(
  collection: Collection<ItemFormData>
) {
  await collection.updateOne(
    { item_name: nom_item_obtenu_du_formulaire },
    { $set: { item_price: prix_item_obtenu_du_formulaire } }
  );
  logger.info("Le prix de l'item a été mis à jour avec succès!");
}
