import { useEffect, useState } from "react";

type Params = {
  imageUri?: string;
  enabled: boolean;
};

export function useMarkerImage({ imageUri, enabled }: Params) {
  const [markerImage, setMarkerImage] = useState<string | null>(null);
  const [sourceKey, setSourceKey] = useState(0);

  // reset when dependencies change
  useEffect(() => {
    setMarkerImage(null);
    setSourceKey((k) => k + 1);
  }, [imageUri]);

  return {
    markerImage,
    setMarkerImage,
    sourceKey,
    shouldGenerate: enabled && !!imageUri && !markerImage,
  };
}
