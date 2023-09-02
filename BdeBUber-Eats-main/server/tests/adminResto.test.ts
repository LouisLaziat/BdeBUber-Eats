import { config } from "dotenv";
import { connectToMongo } from "../src/connexionBD";
import { receiveAddRestoREQ } from "../src/adminResto";

beforeAll(() => {
  config();
});

describe("Ajout d'un restaurant", () => {
  it("should add a restaurant to the database", async () => {
    const formData = new FormData();
    formData.append("resto_name", "Coq La La Grillades");
    formData.append("resto_address", "1530 Henri Bourassa Blvd W");
    formData.append("resto_phone_number", "(514)745-5252");
    formData.append("resto_email", "Aucun Email");
    formData.append(
      "site_web",
      "https://restozone.ca/montreal/coqlala?tab=menu"
    );
    formData.append("resto_opening_hours", "11:00");
    formData.append("resto_closing_hours", "22:00");
    formData.append("resto_city", "Montréal");
    formData.append("critique", "5");
    await receiveAddRestoREQ(formData);
  });
});

afterAll(async () => {
  const client = await connectToMongo(process.env.DB_URI);
  const database = client.db("bdebuber");
  const collection = database.collection("restaurant");
  await collection.deleteOne({ resto_name: "Coq La La Grillades" });
  client.close();
});
