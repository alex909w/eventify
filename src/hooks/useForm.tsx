"use client"

import { useState, useCallback } from "react"

type ValidationRules<T> = {
  [K in keyof T]?: {
    required?: boolean | string
    minLength?: { value: number; message: string }
    maxLength?: { value: number; message: string }
    pattern?: { value: RegExp; message: string }
    validate?: (value: T[K], formValues: T) => string | boolean
  }
}

type FormErrors<T> = {
  [K in keyof T]?: string
}

type TouchedFields<T> = {
  [K in keyof T]?: boolean
}

export function useForm<T extends Record<string, any>>(initialValues: T, validationRules?: ValidationRules<T>) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<FormErrors<T>>({})
  const [touched, setTouched] = useState<TouchedFields<T>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateField = useCallback(
    (name: keyof T, value: any): string => {
      if (!validationRules || !validationRules[name]) return ""

      const rules = validationRules[name]

      // Required validation
      if (rules?.required) {
        const isEmptyValue = value === undefined || value === null || value === ""
        if (isEmptyValue) {
          return typeof rules.required === "string" ? rules.required : "Este campo es obligatorio"
        }
      }

      // Skip other validations if value is empty and not required
      if (value === undefined || value === null || value === "") return ""

      // Min length validation
      if (rules?.minLength && typeof value === "string" && value.length < rules.minLength.value) {
        return rules.minLength.message
      }

      // Max length validation
      if (rules?.maxLength && typeof value === "string" && value.length > rules.maxLength.value) {
        return rules.maxLength.message
      }

      // Pattern validation
      if (rules?.pattern && typeof value === "string" && !rules.pattern.value.test(value)) {
        return rules.pattern.message
      }

      // Custom validation
      if (rules?.validate) {
        const result = rules.validate(value, values)
        if (typeof result === "string") return result
        if (result === false) return "Campo inválido"
      }

      return ""
    },
    [validationRules, values],
  )

  const validateForm = useCallback((): boolean => {
    if (!validationRules) return true

    const newErrors: FormErrors<T> = {}
    let isValid = true

    // Validate all fields
    Object.keys(validationRules).forEach((key) => {
      const fieldName = key as keyof T
      const error = validateField(fieldName, values[fieldName])
      if (error) {
        newErrors[fieldName] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }, [validationRules, validateField, values])

  const handleChange = useCallback(
    (name: keyof T) => (value: any) => {
      setValues((prev) => ({ ...prev, [name]: value }))

      // Validate field if it's been touched
      if (touched[name]) {
        const error = validateField(name, value)
        setErrors((prev) => ({ ...prev, [name]: error }))
      }
    },
    [touched, validateField],
  )

  const handleBlur = useCallback(
    (name: keyof T) => () => {
      setTouched((prev) => ({ ...prev, [name]: true }))
      const error = validateField(name, values[name])
      setErrors((prev) => ({ ...prev, [name]: error }))
    },
    [validateField, values],
  )

  const handleSubmit = useCallback(
    async (onSubmit: (values: T) => Promise<void> | void) => {
      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {} as TouchedFields<T>)
      setTouched(allTouched)

      // Validate all fields
      const isValid = validateForm()

      if (isValid) {
        setIsSubmitting(true)
        try {
          await onSubmit(values)
        } catch (error) {
          console.error("Form submission error:", error)
        } finally {
          setIsSubmitting(false)
        }
      }
    },
    [validateForm, values],
  )

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValues,
  }
}
