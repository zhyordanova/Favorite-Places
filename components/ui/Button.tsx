import { Pressable, StyleSheet, Text } from "react-native";

import { Colors } from "@/constants/colors";
import { Radius, Spacing } from "@/constants/layout";

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
}

export default function Button({ children, onPress, disabled }: ButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    margin: Spacing.xs,
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.primary800,
    borderRadius: Radius.sm,
    elevation: 2,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },

  pressed: {
    opacity: 0.7,
  },

  disabled: {
    opacity: 0.4,
  },

  buttonText: {
    textAlign: "center",
    fontSize: 16,
    color: Colors.primary50,
  },
});
