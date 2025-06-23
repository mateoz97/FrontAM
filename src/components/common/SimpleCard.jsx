import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Avatar,
  IconButton,
  Typography,
  Box,
  Chip,
  Divider,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import PropTypes from 'prop-types';

/**
 * Tarjeta simplificada y accesible
 * - Diseño limpio y espacioso
 * - Indicadores visuales claros
 * - Soporte completo de teclado
 * - Colores y contrastes optimizados
 */
const SimpleCard = ({
  title,
  subtitle,
  content,
  image,
  avatar,
  avatarColor = 'primary',
  status,
  statusColor = 'default',
  actions,
  headerAction,
  elevation = 1,
  clickable = false,
  selected = false,
  fullWidth = true,
  onClick,
  onKeyDown,
  ariaLabel,
  priority = false,
  urgent = false,
  completed = false,
  disabled = false,
  sx = {},
  ...props
}) => {
  const getStatusIcon = () => {
    if (completed) return <CheckCircleIcon color="success" />;
    if (urgent) return <ErrorIcon color="error" />;
    if (priority) return <StarIcon color="warning" />;
    return null;
  };

  const getStatusColor = () => {
    if (completed) return 'success';
    if (urgent) return 'error';
    if (priority) return 'warning';
    return statusColor;
  };

  const handleClick = (event) => {
    if (clickable && !disabled && onClick) {
      onClick(event);
    }
  };

  const handleKeyDown = (event) => {
    if (clickable && !disabled && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      if (onClick) {
        onClick(event);
      }
    }
    if (onKeyDown) {
      onKeyDown(event);
    }
  };

  const cardSx = {
    width: fullWidth ? '100%' : 'auto',
    transition: 'all 0.2s ease-in-out',
    cursor: clickable && !disabled ? 'pointer' : 'default',
    opacity: disabled ? 0.6 : 1,
    border: selected ? '2px solid' : '1px solid',
    borderColor: selected ? 'primary.main' : 'divider',
    backgroundColor: selected ? 'primary.50' : 'background.paper',
    '&:hover': clickable && !disabled ? {
      elevation: elevation + 2,
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
    } : {},
    '&:focus': clickable ? {
      outline: '3px solid',
      outlineColor: 'primary.light',
      outlineOffset: '2px',
    } : {},
    '&:active': clickable && !disabled ? {
      transform: 'translateY(0)',
    } : {},
    ...sx,
  };

  return (
    <Card
      elevation={elevation}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={clickable && !disabled ? 0 : -1}
      role={clickable ? 'button' : 'article'}
      aria-label={ariaLabel || title}
      aria-pressed={clickable && selected ? 'true' : undefined}
      aria-disabled={disabled}
      sx={cardSx}
      {...props}
    >
      {(title || subtitle || avatar || headerAction) && (
        <CardHeader
          avatar={avatar && (
            typeof avatar === 'string' ? (
              <Avatar
                sx={{ 
                  bgcolor: `${avatarColor}.main`,
                  width: 48,
                  height: 48,
                  fontSize: '1.2rem',
                  fontWeight: 600,
                }}
              >
                {avatar}
              </Avatar>
            ) : avatar
          )}
          action={
            headerAction || (clickable && (
              <IconButton 
                aria-label="Más opciones"
                size="large"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertIcon />
              </IconButton>
            ))
          }
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  fontSize: '1.2rem',
                  color: disabled ? 'text.disabled' : 'text.primary',
                }}
              >
                {title}
              </Typography>
              {getStatusIcon()}
            </Box>
          }
          subheader={subtitle && (
            <Typography 
              variant="body2" 
              color={disabled ? 'text.disabled' : 'text.secondary'}
              sx={{ 
                fontSize: '1rem',
                mt: 0.5,
              }}
            >
              {subtitle}
            </Typography>
          )}
          sx={{ pb: content ? 1 : 2 }}
        />
      )}

      {image && (
        <Box
          component="img"
          src={image}
          alt=""
          sx={{
            width: '100%',
            height: 200,
            objectFit: 'cover',
            display: 'block',
          }}
        />
      )}

      {content && (
        <CardContent sx={{ pt: 1 }}>
          {typeof content === 'string' ? (
            <Typography 
              variant="body1" 
              color={disabled ? 'text.disabled' : 'text.primary'}
              sx={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
              }}
            >
              {content}
            </Typography>
          ) : content}

          {status && (
            <Box sx={{ mt: 2 }}>
              <Chip
                label={status}
                color={getStatusColor()}
                variant="filled"
                icon={getStatusIcon()}
                sx={{
                  fontSize: '0.9rem',
                  height: 36,
                  fontWeight: 500,
                }}
              />
            </Box>
          )}
        </CardContent>
      )}

      {actions && (
        <>
          <Divider />
          <CardActions 
            sx={{ 
              p: 2,
              gap: 1,
              justifyContent: 'flex-end',
            }}
          >
            {actions}
          </CardActions>
        </>
      )}
    </Card>
  );
};

SimpleCard.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  image: PropTypes.string,
  avatar: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  avatarColor: PropTypes.string,
  status: PropTypes.string,
  statusColor: PropTypes.oneOf(['default', 'primary', 'secondary', 'success', 'error', 'warning', 'info']),
  actions: PropTypes.node,
  headerAction: PropTypes.node,
  elevation: PropTypes.number,
  clickable: PropTypes.bool,
  selected: PropTypes.bool,
  fullWidth: PropTypes.bool,
  onClick: PropTypes.func,
  onKeyDown: PropTypes.func,
  ariaLabel: PropTypes.string,
  priority: PropTypes.bool,
  urgent: PropTypes.bool,
  completed: PropTypes.bool,
  disabled: PropTypes.bool,
  sx: PropTypes.object,
};

export default SimpleCard;