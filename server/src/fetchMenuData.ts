import { MongoClient, Collection } from "mongodb";
import { connectToMongo } from "./connexionBD";
import { MenuDB, ItemDB, MenuPage } from "./misc";

export async function buildMenu(restoName: string): Promise<MenuPage | null> {
  const rawMenu: MenuDB | null = await fetchRestoMenu(
    await connectToMongo(process.env.DB_URI),
    restoName
  );
  const items: ItemDB[] | null = await fetchItems(
    rawMenu!,
    await connectToMongo(process.env.DB_URI)
  );
  if (rawMenu && items) {
    let builtMenu: MenuPage = {
      resto_name: restoName,
      menu_name: rawMenu!.Menu_Name,
      menu_description: rawMenu!.Menu_Description!,
      item_list: items!,
    };
    return builtMenu;
  }
  return null;
}

async function fetchRestoMenu(
  client: MongoClient,
  restoName: string
): Promise<MenuDB | null> {
  const database = client.db("bdebuber");
  const collection: Collection<MenuDB> = database.collection("menu");
  const query = { Menu_Resto: restoName };
  const cursor = collection.find(query).sort({ _id: 1 });
  const result = await cursor.next();
  client.close();
  return result || null;
}

async function fetchItems(
  menu: MenuDB,
  client: MongoClient
): Promise<ItemDB[] | null> {
  const database = client.db("bdebuber");
  const collection: Collection<ItemDB> = database.collection("item");
  const query = { item_name: { $in: menu.Menu_Items } };
  const cursor = collection.find(query).sort({ _id: 1 });
  const result = await cursor.toArray();
  client.close;
  return result.length ? result : null;
}
