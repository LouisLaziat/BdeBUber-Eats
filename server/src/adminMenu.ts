import { connectToMongo } from "./connexionBD";
import { MongoClient, Collection, Db } from "mongodb";
import { FindCursor , WithId , Document } from "mongodb";
import { UserFormData } from "./misc";

export async function fetchAllItemNames(){

    const client = await connectToMongo(process.env.DB_URI);
    const db: Db = client.db("bdebuber");

    const itemsCollection: Collection = db.collection("item");
    let items = await convertCursorToString(itemsCollection.find());
    
    let itemNames:string[] = [];
    items.forEach(i => {
        itemNames.push(i.item_name);
    });
    
    return items;
}

export async function convertCursorToString(cursor: FindCursor<WithId<Document>>) {
    const documents: WithId<Document>[] = await cursor.toArray(); // Convert cursor to an array of documents
    return documents.map(doc => doc); // Convert each document to a JSON
  }


  export async function addMenuToDB(MenuName: string ,  MenuDescription: string , MenuItems:string[] , MenuRestaurant:string ){

    let result;
    try{
      const client = await connectToMongo(process.env.DB_URI);
    const db: Db = client.db("bdebuber");
    const menuCollection: Collection = db.collection("menu");
    const menu = {
        Menu_Name: MenuName,
        Menu_Description: MenuDescription,
        Menu_Items: MenuItems,
        Menu_Restaurant: MenuRestaurant
    }
    
    result = await menuCollection.insertOne(menu);
    
    } catch (err) {
      console.log("Error inserting menu: " + err);
      
    }
    
    return result;
    
  }

  export async function fetchMenuNames() {
    const client = await connectToMongo(process.env.DB_URI);
    const db: Db = client.db("bdebuber");
    const MenuCollection: Collection = db.collection("restaurant");
  
    const MenuRestaurants: string[] = [];
  
    let menuNames = await convertCursorToString(MenuCollection.find());
      menuNames.forEach(i => {
          MenuRestaurants.push(i.resto_name);
      });
      
    
    return MenuRestaurants;
  
  }
  
  
 