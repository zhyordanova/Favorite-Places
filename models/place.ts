import { randomUUID as expoRandomUUID } from "expo-crypto";

import { Location } from "@/types";

function generatePlaceId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return expoRandomUUID();
}

export class Place {
  id: string;
  title: string;
  imageUri: string;
  address: string;
  location: { lat: number; lng: number };

  constructor(
    title: string,
    imageUri: string,
    location: Location,
    id?: string,
  ) {
    this.id = id ?? generatePlaceId();
    this.title = title;
    this.imageUri = imageUri;
    this.address = location.address;
    this.location = { lat: location.lat, lng: location.lng };
  }
}
