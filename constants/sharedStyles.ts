import { StyleSheet } from "react-native";

import { Colors } from "@/constants/colors";
import { Radius, Spacing } from "@/constants/layout";

export const sharedStyles = StyleSheet.create({
  pickerPreview: {
    height: 200,
    marginVertical: Spacing.md,
    marginHorizontal: Spacing.lg,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Radius.sm,
    overflow: "hidden",
    backgroundColor: Colors.primary100,
    borderColor: Colors.primary500,
    borderWidth: 2,
  },

  pickerActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  statusText: {
    marginTop: Spacing.sm,
    color: Colors.primary700,
    fontWeight: "500",
  },
});
