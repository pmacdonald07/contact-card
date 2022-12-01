import { openDB } from "idb";
import "regenerator-runtime/runtime";

export const initDB = async () => {
  // We are creating a new database named 'contact_db' which will be using version 1 of the database.
  openDB("contact_db", 1, {
    // Add our database schema if it has not already been initialized.
    upgrade(db) {
      if (db.objectStoreNames.contains("contacts")) {
        console.log("contacts store already exists");
        return;
      }
      // Create a new object store for the data and give it a key name of 'id' which will increment automatically
      db.createObjectStore("contacts", { keyPath: "id", autoIncrement: true });
      console.log("contacts store created");
    },
  });
};

export const getDB = async () => {
  console.log("GET from the database");
  const contactDB = await openDB("contact_db", 1);
  const tx = contactDB.transaction("contacts", "readonly");
  const store = tx.objectStore("contacts");
  const request = store.getAll();
  const result = await request;
  console.log("result.value", result);
  return result;
};

export const postDB = async (name, email, phone, profile) => {
  console.log("POST to the database");
  const contactDB = await openDB("contact_db", 1);
  const tx = contactDB.transaction("contacts", "readwrite");
  const store = tx.objectStore("contacts");
  const request = store.add({
    name: name,
    email: email,
    phone: phone,
    profile: profile,
  });
  const result = await request;
  console.log("data saved to the database", result);
};
