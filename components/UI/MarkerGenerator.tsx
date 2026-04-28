import { useEffect, useRef } from "react";
import { Image, StyleSheet, View } from "react-native";
import ViewShot from "react-native-view-shot";

import { Colors } from "@/constants/colors";

type Props = {
  imageUri: string;
  onGenerated: (uri: string) => void;
};

export default function MarkerGenerator({ imageUri, onGenerated }: Props) {
  const ref = useRef<ViewShot>(null);

  useEffect(() => {
    let cancelled = false;

    const generate = async () => {
      if (!ref.current) return;

      try {
        const uri = await ref.current.capture?.();
        if (!cancelled && uri) {
          onGenerated(uri);
        }
      } catch (e) {
        console.log("Marker generation error:", e);
      }
    };

    const timer = setTimeout(generate, 150);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [imageUri]);

  return (
    <View style={styles.hidden}>

      <ViewShot ref={ref} options={{ format: "png", quality: 1 }}>

        <View style={styles.wrapper}>
          <View style={styles.shadow}>

            <View style={styles.circle}>
              <Image source={{ uri: imageUri }} style={styles.image} />
            </View>

          </View>

          <View style={styles.tip} />

        </View>

      </ViewShot>
      
    </View>
  );
}

const styles = StyleSheet.create({
  hidden: {
    position: "absolute",
    left: -9999,
    top: -9999,
  },

  wrapper: {
    alignItems: "center",
  },

  shadow: {
    shadowColor: "#000",
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
    borderRadius: 40,
  },

  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    borderWidth: 4,
    borderColor: Colors.primary200,
    backgroundColor: "#eee",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  tip: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 14,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: Colors.primary200,
    marginTop: -2,
  },
});
