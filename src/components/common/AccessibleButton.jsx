import React from 'react';
import { Button, CircularProgress, Box } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Botón accesible optimizado para usuarios de todas las edades
 * - Tamaños de toque grandes (mínimo 48px)
 * - Colores de alto contraste
 * - Estados de carga claros
 * - Soporte completo de teclado
 */
const AccessibleButton = ({
  children,
  loading = false,
  variant = 'contained',
  size = 'large',
  color = 'primary',
  fullWidth = false,
  disabled = false,
  startIcon,
  endIcon,
  onClick,
  type = 'button',
  ariaLabel,
  ariaDescribedBy,
  sx = {},
  ...props
}) => {
  const handleClick = (event) => {
    if (!loading && !disabled && onClick) {
      onClick(event);
    }
  };

  const handleKeyDown = (event) => {
    if ((event.key === 'Enter' || event.key === ' ') && !loading && !disabled) {
      event.preventDefault();
      if (onClick) {
        onClick(event);
      }
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      color={color}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      startIcon={loading ? undefined : startIcon}
      endIcon={loading ? undefined : endIcon}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      type={type}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      aria-describedby={ariaDescribedBy}
      role="button"
      tabIndex={disabled ? -1 : 0}
      sx={{
        position: 'relative',
        minHeight: size === 'large' ? 56 : size === 'medium' ? 48 : 40,
        fontSize: size === 'large' ? '1.1rem' : size === 'medium' ? '1rem' : '0.9rem',
        fontWeight: 600,
        letterSpacing: '0.5px',
        boxShadow: variant === 'contained' ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
        '&:hover': {
          transform: disabled || loading ? 'none' : 'translateY(-2px)',
          boxShadow: variant === 'contained' && !disabled && !loading 
            ? '0 4px 16px rgba(0,0,0,0.2)' 
            : 'none',
        },
        '&:focus': {
          outline: '3px solid',
          outlineColor: 'primary.light',
          outlineOffset: '2px',
        },
        '&:active': {
          transform: disabled || loading ? 'none' : 'translateY(0)',
        },
        ...sx,
      }}
      {...props}
    >
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <CircularProgress 
            size={20} 
            color="inherit"
            aria-label="Cargando"
          />
        </Box>
      )}
      <Box
        sx={{
          opacity: loading ? 0 : 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {startIcon}
        {children}
        {endIcon}
      </Box>
    </Button>
  );
};

AccessibleButton.propTypes = {
  children: PropTypes.node.isRequired,
  loading: PropTypes.bool,
  variant: PropTypes.oneOf(['contained', 'outlined', 'text']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'error', 'warning', 'info']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  ariaLabel: PropTypes.string,
  ariaDescribedBy: PropTypes.string,
  sx: PropTypes.object,
};

export default AccessibleButton;