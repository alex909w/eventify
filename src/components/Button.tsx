import type React from "react"
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator, type ViewStyle, type TextStyle } from "react-native"

type ButtonProps = {
  title: string
  onPress: () => void
  variant?: "primary" | "secondary" | "outline" | "danger"
  loading?: boolean
  disabled?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
  icon?: React.ReactNode
}

const Button = ({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}: ButtonProps) => {
  const getButtonStyle = () => {
    switch (variant) {
      case "secondary":
        return styles.secondaryButton
      case "outline":
        return styles.outlineButton
      case "danger":
        return styles.dangerButton
      default:
        return styles.primaryButton
    }
  }

  const getTextStyle = () => {
    switch (variant) {
      case "outline":
        return styles.outlineButtonText
      default:
        return styles.buttonText
    }
  }

  return (
    <TouchableOpacity
      style={[getButtonStyle(), disabled && styles.disabledButton, style]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === "outline" ? "#146193" : "#fff"} />
      ) : (
        <>
          {icon}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: "#146193",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  secondaryButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#146193",
    flexDirection: "row",
  },
  dangerButton: {
    backgroundColor: "#F44336",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  outlineButtonText: {
    color: "#146193",
    fontWeight: "bold",
    fontSize: 16,
  },
})

export default Button
