import { config } from "dotenv";
import { checkValidConnection } from "../src/connexionBD";

describe("Connection à l'application", () => {
  beforeAll(() => {
    config();
  });

  it("should return true when valid parameters are provided", async () => {
    const result = await checkValidConnection(
      "youssef.hamdouni.yh@gmail.com",
      "IloveNode1234!"
    );
    expect(result).not.toBeNull();
  });

  it("should return false when invalid parameters are provided", async () => {
    const result = await checkValidConnection(
      "youssef.hamdouni.yh@gail.com",
      "IloveOracle12!"
    );
    expect(result).toBeUndefined();
  });
});
