import { config } from "dotenv";
import { fetchSearchQuery } from "../src/fetchSearchQuery";
import { MapData } from "../src/misc";
import { loadMap } from "../src/fetchRestoData";
import { connectToMongo } from "../src/connexionBD";

beforeAll(() => {
  config();
});

describe("Restaurant search", () => {
  let allResto: MapData[] = [];
  it("should return a list with at least one element inside it", async () => {
    allResto = await loadMap();
    const client = await connectToMongo(process.env.DB_URI);
    const result = await fetchSearchQuery("sushi", client, allResto);
    expect(result!.length).toBeGreaterThan(0);
  }, 20000);

  it("should return an empty list when an invalid query is provided", async () => {
    allResto = await loadMap();
    const client = await connectToMongo(process.env.DB_URI);
    const result = await fetchSearchQuery("qwertyuiop", client, allResto);
    expect(result).toStrictEqual([]);
  }, 20000);
});
