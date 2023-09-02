import { MongoClient, Collection, Db } from "mongodb";
import { RestoDB, UserFormData } from "./misc";
import { connectToMongo } from "./connexionBD";

export async function receiveAddRestoREQ(
  formData: FormData | { [key: string]: any }
) {
  let form = new FormData();
  if (!(formData instanceof FormData)) {
    for (const key in formData) {
      form.append(key, formData[key]);
    }
  } else form = formData;

  await insertElements(form, await connectToMongo(process.env.DB_URI));
}

async function insertElements(formElements: FormData, client: MongoClient) {
  const database = client.db("bdebuber");
  const collection: Collection<RestoDB> = database.collection("restaurant");
  formElements.get("critique")?.toString();
  const resto: RestoDB = {
    restaurant_id: ((await trouverID(database)) + 1).toString() || "",
    resto_name: formElements.get("resto_name")?.toString() || "",
    resto_address: formElements.get("resto_address")?.toString() || "",
    resto_phone_number:
      formElements.get("resto_phone_number")?.toString() || "",
    resto_email: formElements.get("resto_email")?.toString() || "",
    site_web: formElements.get("site_web")?.toString() || "",
    resto_heures: (await heuresOuverture(formElements)) || "",
    resto_city: formElements.get("resto_city")?.toString() || "",
    critique: formElements.get("critique")?.toString() || "",
  };

  const result = await collection.insertOne(resto);
  client.close();
  result;
}

async function trouverID(database: Db): Promise<number> {
  const collection = database.collection("restaurant");
  const count = await collection.countDocuments();
  return count;
}

async function heuresOuverture(formData: FormData): Promise<string> {
  const heuresOuverture = `${formData.get(
    "resto_opening_hours"
  )}-${formData.get("resto_closing_hours")}`;
  return heuresOuverture;
}
