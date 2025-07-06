import { useState, useCallback, useMemo } from 'react';

/**
 * Hook para manejo de formularios accesibles
 * Simplifica la validación y proporciona retroalimentación clara
 */
export const useAccessibleForm = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // Actualizar un campo específico
  const updateField = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error si el campo ahora tiene valor
    if (value && errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null,
      }));
    }
  }, [errors]);

  // Marcar un campo como tocado (enfocado y luego perdió el foco)
  const markTouched = useCallback((name) => {
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));
  }, []);

  // Validar un campo específico
  const validateField = useCallback((name, value) => {
    const rules = validationRules[name];
    if (!rules) return null;

    // Validación requerida
    if (rules.required && (!value || value.toString().trim() === '')) {
      return `${rules.label || name} es obligatorio`;
    }

    // Validación de longitud mínima
    if (rules.minLength && value && value.length < rules.minLength) {
      return `${rules.label || name} debe tener al menos ${rules.minLength} caracteres`;
    }

    // Validación de longitud máxima
    if (rules.maxLength && value && value.length > rules.maxLength) {
      return `${rules.label || name} no puede tener más de ${rules.maxLength} caracteres`;
    }

    // Validación de email
    if (rules.email && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Ingresa un email válido (ejemplo: nombre@empresa.com)';
      }
    }

    // Validación de teléfono
    if (rules.phone && value) {
      const phoneRegex = /^\+?[\d\s\-()]+$/;
      if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 10) {
        return 'Ingresa un teléfono válido (ejemplo: +57 300 123 4567)';
      }
    }

    // Validación personalizada
    if (rules.custom && typeof rules.custom === 'function') {
      return rules.custom(value, values);
    }

    return null;
  }, [validationRules, values]);

  // Validar todos los campos
  const validateForm = useCallback(() => {
    const newErrors = {};
    let formIsValid = true;

    Object.keys(validationRules).forEach(fieldName => {
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        formIsValid = false;
      }
    });

    setErrors(newErrors);
    setIsValid(formIsValid);
    return formIsValid;
  }, [validationRules, values, validateField]);

  // Manejar cambio de campo
  const handleChange = useCallback((name) => (event) => {
    const value = event.target.value;
    updateField(name, value);
    
    // Validar en tiempo real si el campo ya fue tocado
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error,
      }));
    }
  }, [updateField, touched, validateField]);

  // Manejar pérdida de foco
  const handleBlur = useCallback((name) => () => {
    markTouched(name);
    const error = validateField(name, values[name]);
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  }, [markTouched, validateField, values]);

  // Obtener props para un campo específico
  const getFieldProps = useCallback((name, options = {}) => {
    const rules = validationRules[name] || {};
    
    return {
      name,
      value: values[name] || '',
      onChange: handleChange(name),
      onBlur: handleBlur(name),
      error: touched[name] ? errors[name] : null,
      required: rules.required || false,
      helperText: options.helperText || rules.helperText,
      ...options,
    };
  }, [values, handleChange, handleBlur, touched, errors, validationRules]);

  // Resetear formulario
  const reset = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setIsValid(false);
  }, [initialValues]);

  // Manejar envío del formulario
  const handleSubmit = useCallback((onSubmit) => async (event) => {
    if (event) {
      event.preventDefault();
    }

    // Marcar todos los campos como tocados
    const allFields = Object.keys(validationRules);
    const newTouched = {};
    allFields.forEach(field => {
      newTouched[field] = true;
    });
    setTouched(newTouched);

    // Validar formulario
    const isFormValid = validateForm();
    
    if (!isFormValid) {
      // Enfocar el primer campo con error
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        if (element) {
          element.focus();
        }
      }
      return;
    }

    try {
      setIsSubmitting(true);
      if (onSubmit) {
        await onSubmit(values);
      }
    } catch (error) {
      console.error('Error en envío del formulario:', error);
      // El error debe ser manejado por el componente que usa el hook
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [validationRules, validateForm, errors, values]);

  // Estado calculado del formulario
  const formState = useMemo(() => {
    const touchedFields = Object.keys(touched);
    const hasErrors = Object.values(errors).some(error => error !== null);
    const hasValues = Object.values(values).some(value => value !== '' && value !== null && value !== undefined);
    
    return {
      isValid: isValid && !hasErrors,
      hasErrors,
      hasValues,
      isDirty: touchedFields.length > 0,
      isSubmitting,
      canSubmit: isValid && !hasErrors && !isSubmitting,
    };
  }, [touched, errors, values, isValid, isSubmitting]);

  return {
    // Valores y estado
    values,
    errors,
    touched,
    formState,
    
    // Acciones
    updateField,
    markTouched,
    validateField,
    validateForm,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldProps,
    reset,
  };
};