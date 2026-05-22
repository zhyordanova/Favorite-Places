import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";

import { Coordinates } from "@/types";

interface PickedLocationContextValue {
  pickedMapLocation: Coordinates | undefined;
  setPickedMapLocation: (location: Coordinates) => void;
  clearPickedMapLocation: () => void;
}

const PickedLocationContext = createContext<
  PickedLocationContextValue | undefined
>(undefined);

export function PickedLocationProvider({ children }: PropsWithChildren) {
  const [pickedMapLocation, setPickedMapLocation] = useState<
    Coordinates | undefined
  >();

  const value = useMemo(
    () => ({
      pickedMapLocation,
      setPickedMapLocation,
      clearPickedMapLocation: () => setPickedMapLocation(undefined),
    }),
    [pickedMapLocation],
  );

  return (
    <PickedLocationContext.Provider value={value}>
      {children}
    </PickedLocationContext.Provider>
  );
}

export function usePickedLocation() {
  const context = useContext(PickedLocationContext);

  if (!context) {
    throw new Error(
      "usePickedLocation must be used within PickedLocationProvider.",
    );
  }

  return context;
}
