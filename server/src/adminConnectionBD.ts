import { connectToMongo } from "./connexionBD";
import { hashAndSalt } from "./inscriptionBD";
import { MongoClient, Collection, Db } from "mongodb";

export async function verifyAdminPassword(
  password: string,
  userPrename: string
) {
  const client = await connectToMongo(process.env.DB_URI);
  const hashedPass = hashAndSalt(password);

  const db: Db = client.db("bdebuber");
  const adminsCollection: Collection = db.collection("admin");

  const admin = await adminsCollection.findOne({
    Admin_Password: hashedPass,
    Admin_Prename: userPrename,
  });
  hashedPass;
  userPrename;
  admin;
  return admin != null;
}
