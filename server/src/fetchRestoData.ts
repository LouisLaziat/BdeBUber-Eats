import { MongoClient, Collection } from "mongodb";
import { MapData, RestoDB } from "./misc";
import axios from "axios";
import { connectToMongo } from "./connexionBD";
import logger from "./winstonconfig";

export async function loadMap(): Promise<MapData[]> {
  let restaurants: MapData[] = [];
  try {
    const restoDBs: RestoDB[] | null = await fetchRestaurantInfo(
      await connectToMongo(process.env.DB_URI)
    );
    for (let i = 0; i < restoDBs.length; i++) {
      const resto = restoDBs[i];
      const address = resto.resto_address.split(", ")[0];
      let restoName = "";
      switch (resto.resto_name) {
        case "Mythos Ouzeri Restaurant":
          restoName = "";
          break;
        case "EL RAY DEL TACO":
          restoName = "";
          break;
        default:
          restoName = resto.resto_name;
          break;
      }
      const url = `https://us1.locationiq.com/v1/search?key=pk.879d6106d0c6ed9098e8c23d330af133&q=${encodeURIComponent(
        `${restoName} ${address} ${resto.resto_city}`
      )}&format=json&accept-language=fr,en&limit=1`;
      let found = false;
      while (!found) {
        await sleep(600);
        try {
          const LIQresponse = await axios.get(url);
          logger.info("Received response from LocationIQ API");
          for (let j = 0; j < LIQresponse.data.length; j++) {
            const latitude = LIQresponse.data[j].lat;
            const longitude = LIQresponse.data[j].lon;
            const existingRestaurant = restaurants.find(
              (r) =>
                r.restaurant.resto_name === resto.resto_name ||
                r.latitude === latitude
            );
            const displayName = resto.resto_name;
            if (!existingRestaurant) {
              restaurants.push({
                restaurant: resto,
                latitude,
                longitude,
              });
              found = true;
            }
          }
        } catch (err: any) {
          logger.error("There was an error: " + err.message);
        }
      }
    }
  } catch (err: any) {
    logger.error("Error with database connection 😢");
    logger.error(err.message);
  }
  return restaurants;
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchRestaurantInfo(
  client: MongoClient
): Promise<RestoDB[]> {
  const database = client.db("bdebuber");
  const collection: Collection<RestoDB> = database.collection("restaurant");

  const cursor = collection.find().sort({ restaurant_id: 1 });
  const results = await cursor.toArray();
  client.close();
  return results;
}
