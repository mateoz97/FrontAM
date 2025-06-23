import React, { useState } from 'react';
import {
  TextField,
  FormControl,
  FormLabel,
  FormHelperText,
  Box,
  InputAdornment,
  IconButton,
  Alert,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Error as ErrorIcon,
  CheckCircle as SuccessIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import PropTypes from 'prop-types';

/**
 * Campo de formulario simplificado y accesible
 * - Etiquetas claras y grandes
 * - Retroalimentación visual inmediata
 * - Mensajes de ayuda en lenguaje simple
 * - Soporte completo de teclado
 */
const SimpleFormField = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  helperText,
  errorText,
  successText,
  required = false,
  disabled = false,
  multiline = false,
  rows = 4,
  maxLength,
  showCharacterCount = false,
  startIcon,
  endIcon,
  autoComplete,
  ariaLabel,
  id,
  name,
  fullWidth = true,
  size = 'large',
  example,
  sx = {},
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const isPassword = type === 'password';
  const hasError = Boolean(errorText);
  const hasSuccess = Boolean(successText) && !hasError;
  const characterCount = value ? value.length : 0;
  const isOverLimit = maxLength && characterCount > maxLength;

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  const getFieldColor = () => {
    if (hasError) return 'error';
    if (hasSuccess) return 'success';
    return 'primary';
  };

  const getStatusIcon = () => {
    if (hasError) return <ErrorIcon color="error" />;
    if (hasSuccess) return <SuccessIcon color="success" />;
    return null;
  };

  const fieldId = id || `field-${name || label?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <FormControl 
      fullWidth={fullWidth} 
      error={hasError}
      sx={{ mb: 3, ...sx }}
    >
      {label && (
        <FormLabel
          htmlFor={fieldId}
          required={required}
          sx={{
            mb: 1,
            fontSize: '1.1rem',
            fontWeight: 600,
            color: focused ? 'primary.main' : 'text.primary',
            '&.Mui-focused': {
              color: 'primary.main',
            },
            '&.Mui-error': {
              color: 'error.main',
            },
          }}
        >
          {label}
          {required && (
            <Box component="span" sx={{ color: 'error.main', ml: 0.5 }}>
              *
            </Box>
          )}
        </FormLabel>
      )}

      <TextField
        id={fieldId}
        name={name}
        type={isPassword ? (showPassword ? 'text' : 'password') : type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        multiline={multiline}
        rows={multiline ? rows : undefined}
        autoComplete={autoComplete}
        aria-label={ariaLabel || label}
        aria-describedby={`${fieldId}-helper`}
        color={getFieldColor()}
        size={size}
        fullWidth={fullWidth}
        onFocus={handleFocus}
        onBlur={handleBlur}
        inputProps={{
          maxLength: maxLength,
          'aria-invalid': hasError,
          style: {
            fontSize: '1.1rem',
            padding: '16px 14px',
          },
        }}
        InputProps={{
          startAdornment: startIcon && (
            <InputAdornment position="start">
              {startIcon}
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {isPassword && (
                <IconButton
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  onClick={handleTogglePassword}
                  edge="end"
                  size="large"
                  sx={{ mr: -1 }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              )}
              {!isPassword && (endIcon || getStatusIcon())}
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: 'background.paper',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: 2,
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: 2,
              },
            },
          },
        }}
        {...props}
      />

      <Box sx={{ mt: 1, minHeight: 24 }}>
        {/* Texto de ejemplo */}
        {example && !hasError && !hasSuccess && !focused && (
          <Alert 
            severity="info" 
            variant="outlined"
            sx={{ 
              py: 0.5,
              '& .MuiAlert-icon': {
                fontSize: '1rem',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoIcon fontSize="small" />
              Ejemplo: {example}
            </Box>
          </Alert>
        )}

        {/* Mensajes de error */}
        {hasError && (
          <FormHelperText 
            id={`${fieldId}-helper`}
            error
            sx={{ 
              fontSize: '1rem',
              fontWeight: 500,
              mt: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <ErrorIcon fontSize="small" />
            {errorText}
          </FormHelperText>
        )}

        {/* Mensajes de éxito */}
        {hasSuccess && (
          <FormHelperText 
            id={`${fieldId}-helper`}
            sx={{ 
              fontSize: '1rem',
              fontWeight: 500,
              mt: 1,
              color: 'success.main',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <SuccessIcon fontSize="small" />
            {successText}
          </FormHelperText>
        )}

        {/* Texto de ayuda normal */}
        {helperText && !hasError && !hasSuccess && (
          <FormHelperText 
            id={`${fieldId}-helper`}
            sx={{ 
              fontSize: '0.95rem',
              mt: 1,
            }}
          >
            {helperText}
          </FormHelperText>
        )}

        {/* Contador de caracteres */}
        {showCharacterCount && maxLength && (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end',
              mt: 1,
            }}
          >
            <FormHelperText
              sx={{
                fontSize: '0.9rem',
                color: isOverLimit ? 'error.main' : 'text.secondary',
                fontWeight: isOverLimit ? 600 : 400,
              }}
            >
              {characterCount}/{maxLength}
            </FormHelperText>
          </Box>
        )}
      </Box>
    </FormControl>
  );
};

SimpleFormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  helperText: PropTypes.string,
  errorText: PropTypes.string,
  successText: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  multiline: PropTypes.bool,
  rows: PropTypes.number,
  maxLength: PropTypes.number,
  showCharacterCount: PropTypes.bool,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  autoComplete: PropTypes.string,
  ariaLabel: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  fullWidth: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  example: PropTypes.string,
  sx: PropTypes.object,
};

export default SimpleFormField;