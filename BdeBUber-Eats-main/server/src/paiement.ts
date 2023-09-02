import { loadStripe } from "../node_modules/@stripe/stripe-js";
import { PaymentData } from "./misc";
const config = require("../src/stripe");
import { MongoClient, Collection, Db } from "mongodb";
const stripe = require("stripe")(config.secretKey);
import logger from "./winstonconfig";
import { CommandeBD, ItemDB } from "./misc";
import { connectToMongo } from "./connexionBD";
import { Console } from "winston/lib/winston/transports";

export async function receivePaymentREQ(
  data: any | { [key: string]: any }
): Promise<string> {

  const numeroCommande = await genererNumeroCommande(await connectToMongo(process.env.DB_URI));
  await insertElements(data, await connectToMongo(process.env.DB_URI), numeroCommande);

  return numeroCommande;
}



//Pour insérer une commande dans la BD pour avoir des traces au cas où il y a des problèmes avec une commande
async function insertElements(data: any, client: MongoClient, id: string) {

  logger.info("received insertion request");
  const cartData = JSON.parse(data.cart); //On extrait le panier pour savoir ce qu'il a acheté
  const userData = JSON.parse(data.user); //Ainsi que les infos de l'utilisateur pour savoir c'est qui

  const database = client.db("bdebuber");
  const collection: Collection<CommandeBD> = database.collection("commande");
  const commande: CommandeBD = { //On insère les infos dans la BD
    commande_id: id || "",
    cart: cartData || "",
    user: userData || "",
  };

  const result = await collection.insertOne(commande);
  await removeItems(data, database);
  client.close();
  result;
}

async function removeItems(data: any, database: any) { //Pour enlever les items qui ont été acheté (Update la quantité d'items dans la BD)
  const cartData = JSON.parse(data.cart);
  logger.info(cartData);
  const collection: Collection<ItemDB> = database.collection("item");

  for (const item of cartData) {
    const itemTrouve = await collection.findOne({ item_name: item.name }); //On cherche l'item acheté dans la BD
    if (itemTrouve) {
      const newQuantity = itemTrouve.item_quantite - item.quantity; //On soustrait la quantité toal d'item par la quantité acheté pour trouver la quantité restante
      await collection.updateOne({ item_name: item.name }, { $set: { item_quantite: newQuantity } }); //Puis on update la quantité
    }

  }

}

async function genererNumeroCommande(client: MongoClient) { //Pour générer un numéro de commande aléatoire
  const database = client.db("bdebuber");
  const collection: Collection<CommandeBD> = database.collection("commande");
  const length = 20;
  let result = "";
  let valide = false;
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const lettersLength = letters.length;
  const numbersLength = numbers.length;

  while (!valide) {
    for (let i = 0; i < 3; i++) {
      result += numbers.charAt(Math.floor(Math.random() * numbersLength));
    }

    // Générer les lettres et chiffres restants en alternance
    for (let i = 3; i < length; i++) {
      if (i % 2 === 0) {
        result += numbers.charAt(Math.floor(Math.random() * numbersLength));
      } else {
        result += letters.charAt(Math.floor(Math.random() * lettersLength));
      }
    }

    if (await collection.findOne({ commande_id: result })) { //Pour s'assurer que le numéro de commande générer n'existe pas déjà dans la BD
      valide = false;
      result = "";
    }
    else {
      valide = true;
    }
  }

  return result;
}

