import { config } from "dotenv";
import { addMenuToDB } from "../src/adminMenu";
import { connectToMongo } from "../src/connexionBD";

beforeAll(() => {
  config();
});

describe("Test de la fonction addMenuToDB", () => {
  const menuName: string = "Menu Test";
  const menuDescription: string = "Menu de test";
  const menuItems: string[] = ["Item 1", "Item 2"];
  const menuRestaurant: string = "Restaurant Test";
  it("should insert a new menu if it doesn't exist in the database", async () => {
    const result = await addMenuToDB(
      menuName,
      menuDescription,
      menuItems,
      menuRestaurant
    );
    expect(result?.acknowledged).toBe(true);
  });
});

afterAll(async () => {
  const client = await connectToMongo(process.env.DB_URI);
  const db = client.db();
  await db.collection("menu").deleteOne({ menu_name: "Menu Test" });
  client.close();
});
