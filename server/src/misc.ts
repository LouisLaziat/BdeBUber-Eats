export type MapData = {
  restaurant: RestoDB;
  latitude: number;
  longitude: number;
};

export type RestoDB = {
  restaurant_id: string;
  resto_name: string;
  resto_address: string;
  resto_phone_number: string;
  resto_email: string;
  site_web: string;
  resto_heures: string;
  resto_city: string;
  critique: string;
};

export type CommandeBD = {
  commande_id: string;
  cart: string;
  user: string;
}

export type UserFormData = {
  name: string;
  prename: string;
  email: string;
  address: Array<String>;
  city: string;
  phone: string;
  password: string;
  country?: string;
};

export type MenuDB = {
  _id: string;
  Menu_Name: string;
  Menu_Description: string | null;
  Menu_Items: string[];
  Menu_Resto: string;
};

export type ItemDB = {
  _id: string;
  item_name: string;
  item_description: string;
  item_prix: number;
  item_quantite: number;
};

export type MenuPage = {
  resto_name: string;
  menu_name: string;
  menu_description: string;
  item_list: ItemDB[];
};

export type PaymentData = {
  ccName: number;
  ccNumber: number;
  ccExpiration: number;
  ccCVV: number;
};

export type ItemFormData = {
  item_name: string;
  item_description: string;
  item_price: string;
  item_quantity: string;
};

export type UserConnected = {
  granted: boolean;
  name: string;
  prename: string;
  email: string;
  address: Array<string>;
}
export type MenuItem = {
  name: string;
  price: number;
  quantity: number;
};

export type Order = MenuItem[];

