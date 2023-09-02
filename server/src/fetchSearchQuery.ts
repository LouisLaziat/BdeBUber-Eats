import { connectToMongo } from "./connexionBD";
import { MapData, MenuDB, RestoDB } from "./misc";
import { Collection, MongoClient } from "mongodb";

export async function fetchSearchQuery(
  query: string,
  client: MongoClient,
  allRestaurants: MapData[]
): Promise<MapData[] | null> {
  const db = client.db("bdebuber");

  // Find all menus that match the query
  const menus = await db
    .collection<MenuDB>("menu")
    .find({
      $or: [
        { Menu_Name: { $regex: query, $options: "i" } },
        { Menu_Items: { $regex: query, $options: "i" } },
        { Menu_Resto: { $regex: query, $options: "i" } },
      ],
    })
    .toArray();

  const mapData: MapData[] = menus.flatMap((menu) => {
    const restaurant = allRestaurants.find(
      (resto) => resto.restaurant.resto_name === menu.Menu_Resto
    );
    return restaurant
      ? menu.Menu_Items.map((item) => ({
          restaurant: restaurant.restaurant,
          latitude: restaurant.latitude,
          longitude: restaurant.longitude,
        }))
      : [];
  });
  return mapData;
}
