import * as SQLite from "expo-sqlite";

import { Place } from "../models/place";

const databasePromise = SQLite.openDatabaseAsync("places.db");

export async function init(): Promise<void> {
  const database = await databasePromise;

  await database.execAsync(`CREATE TABLE IF NOT EXISTS places (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    imageUri TEXT NOT NULL,
    address TEXT NOT NULL,
    lat REAL NOT NULL,
    lng REAL NOT NULL
  )`);
}

export async function insertPlace(place: Place): Promise<void> {
  const database = await databasePromise;
  await database.runAsync(
    `INSERT INTO places (id, title, imageUri, address, lat, lng) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      place.id,
      place.title,
      place.imageUri,
      place.address,
      place.location.lat,
      place.location.lng,
    ],
  );
}

export async function fetchPlaces(): Promise<Place[]> {
  const database = await databasePromise;
  const result = await database.getAllAsync<{
    id: string;
    title: string;
    imageUri: string;
    address: string;
    lat: number;
    lng: number;
  }>(`SELECT * FROM places`);

  return result.map(
    (row) =>
      new Place(
        row.title,
        row.imageUri,
        { address: row.address, lat: row.lat, lng: row.lng },
        row.id,
      ),
  );
}

export async function fetchPlaceDetails(id: string): Promise<Place> {
  const database = await databasePromise;
  const result = await database.getFirstAsync<{
    id: string;
    title: string;
    imageUri: string;
    address: string;
    lat: number;
    lng: number;
  }>(`SELECT * FROM places WHERE id = ?`, [id]);

  if (!result) {
    throw new Error("Could not find place with the provided id.");
  }

  return new Place(
    result.title,
    result.imageUri,
    { address: result.address, lat: result.lat, lng: result.lng },
    result.id,
  );
}
