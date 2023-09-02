import { config } from "dotenv";
import { insererItem } from "../src/adminItem";
import { connectToMongo } from "../src/connexionBD";

beforeAll(() => {
  config();
});

describe("Test de la fonction insererItem", () => {
  it("should insert a new item if it doesn't exist in the database", async () => {
    const formData = new FormData();
    formData.append("item_name", "Couscous");
    formData.append("description_item", "Couscous au poulet");
    formData.append("prix_item", "23");
    formData.append("quantite_item", "69");
    await insererItem(formData);
  });
  it("should update the quantity of an existing item in the database", async () => {
    const formData = new FormData();
    formData.append("item_name", "Couscous");
    formData.append("description_item", "Couscous au poulet");
    formData.append("prix_item", "23");
    formData.append("quantite_item", "99");
    await insererItem(formData);
  });
});

//After all tests are finished, delete the item from the database
afterAll(async () => {
  const client = await connectToMongo(process.env.DB_URI);
  const db = client.db();
  await db.collection("item").deleteOne({ item_name: "Couscous" });
  client.close();
});
