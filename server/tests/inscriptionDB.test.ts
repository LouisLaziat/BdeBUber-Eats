import { receiveInsREQ } from "../src/inscriptionBD";
import { connectToMongo } from "../src/connexionBD";
import { config } from "dotenv";
import { UserFormData } from "../src/misc";

beforeAll(() => {
  config();
});

describe("Inscription au site", () => {
  const formData = new FormData();
  formData.append("email", "jfbrodeur@gmail.com");
  formData.append("password", "IloveOracle12!");
  formData.append("confirmPassword", "IloveOracle12!");
  formData.append("name", "Brodeur");
  formData.append("prename", "Jean-François");
  formData.append("address", "123 rue de la rue");
  formData.append("city", "Montréal");
  formData.append("phone", "514-555-5555");

  it("should return true when valid form data is provided", async () => {
    const result = await receiveInsREQ(formData);
    expect(result).toBe(true);
  });

  it("should return false when invalid password is provided", async () => {
    formData.set("password", "short"); // Set an invalid password
    const result = await receiveInsREQ(formData);
    expect(result).toBe(false);
  }, 10000);

  it("should return false when email is already used", async () => {
    const existingEmailFormData = new FormData();
    existingEmailFormData.append("email", "youssef.hamdouni.yh@gmail.com");
    existingEmailFormData.append("password", "IloveOracle12!");
    existingEmailFormData.append("confirmPassword", "IloveOracle12!");
    existingEmailFormData.append("nom", "Brodeur");
    existingEmailFormData.append("prename", "Jean-François");
    existingEmailFormData.append("address", "123 rue de la rue");
    existingEmailFormData.append("city", "Montréal");
    existingEmailFormData.append("phone", "514-555-5555");
    const result = await receiveInsREQ(existingEmailFormData);
    expect(result).toBe(false);
  }, 10000);
});

afterAll(async () => {
  const client = await connectToMongo(process.env.DB_URI);
  const db = client.db();
  await db
    .collection<UserFormData>("utilisateur")
    .deleteMany({ name: "Brodeur" });
  client.close();
});
