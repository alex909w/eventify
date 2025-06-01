import { StyleSheet, View, Text, TextInput, type TextInputProps } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface InputProps extends TextInputProps {
  label?: string
  error?: string
  icon?: keyof typeof Ionicons.glyphMap
  touched?: boolean
}

const Input = ({ label, error, icon, touched, style, ...props }: InputProps) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          error && touched ? styles.inputError : null,
          props.editable === false ? styles.inputDisabled : null,
          style,
        ]}
      >
        {icon && <Ionicons name={icon} size={20} color="#666" style={styles.icon} />}
        <TextInput style={[styles.input, icon ? styles.inputWithIcon : null]} placeholderTextColor="#999" {...props} />
      </View>
      {error && touched && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  inputError: {
    borderColor: "#F44336",
  },
  inputDisabled: {
    backgroundColor: "#f0f0f0",
    opacity: 0.7,
  },
  icon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  inputWithIcon: {
    paddingLeft: 8,
  },
  errorText: {
    color: "#F44336",
    fontSize: 14,
    marginTop: 4,
  },
})

export default Input
