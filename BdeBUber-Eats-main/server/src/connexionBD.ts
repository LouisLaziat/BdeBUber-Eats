import { hashAndSalt } from "./inscriptionBD";
import { MongoClient, Collection } from "mongodb";
import { UserFormData } from "./misc";
import logger from "./winstonconfig";

export async function connectToMongo(
  uri: string | undefined
): Promise<MongoClient> {
  let mongoClient;
  try {
    mongoClient = new MongoClient(uri || "");
    logger.info("Connection  MongoDB...");
    await mongoClient.connect();
    logger.info("Connected to MongoDB!");
    return mongoClient;
  } catch (err) {
    logger.info(process.env.DB_URI);
    logger.error(`Connection error 💀: ${err}`);
    process.exit();
  }
}

export async function checkValidConnection(
  email: string,
  password: string
): Promise<UserFormData | null> {
  try {
    const actualPassword: string = hashAndSalt(password);
    const dbResult: UserFormData = await fetchUserData(
      await connectToMongo(process.env.DB_URI),
      actualPassword,
      email
    );
    return dbResult;
  } catch (err) {
    logger.error("Error with database 😢", err);
    return null;
  }
}

async function fetchUserData(
  client: MongoClient,
  password: string,
  email: string
): Promise<UserFormData> {
  const database = client.db("bdebuber");
  const collection: Collection<UserFormData> =
    database.collection("utilisateur");

  const query = { email: email, password: password };
  const cursor = collection.find(query);
  const results = await cursor.toArray();
  client.close();
  return results[0];
}
