import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text } from "react-native";

import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/layout";

interface OutlinedButtonProps {
  onPress: () => void;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  children: React.ReactNode;
  disabled?: boolean;
}

export default function OutlinedButton({
  onPress,
  icon,
  children,
  disabled = false,
}: OutlinedButtonProps) {
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
      <Ionicons
        style={styles.icon}
        name={icon}
        size={18}
        color={Colors.primary500}
      />

      <Text style={styles.buttonText}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    marginVertical: Spacing.md,
    marginHorizontal: Spacing.lg,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.primary500,
  },

  pressed: {
    opacity: 0.7,
  },

  icon: {
    marginRight: 6,
  },

  buttonText: {
    color: Colors.primary500,
  },

  disabled: {
    opacity: 0.5,
  },
});
