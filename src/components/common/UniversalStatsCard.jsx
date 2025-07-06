// src/components/common/UniversalStatsCard.jsx
import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  IconButton,
  LinearProgress,
  Chip,
  useTheme,
  alpha,
  Tooltip,
  Skeleton,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  MoreVert as MoreVertIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

const UniversalStatsCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  trendLabel,
  color = 'primary',
  loading = false,
  progress,
  progressLabel,
  actions,
  onClick,
  variant = 'default',
  size = 'medium',
  showTrend = true,
  customColor,
  badge,
  description,
  animate = true,
}) => {
  const theme = useTheme();
  
  const colorValue = customColor || 
    (typeof color === 'string' ? theme.palette[color]?.main : color) || 
    theme.palette.primary.main;

  const getTrendIcon = () => {
    if (trend > 0) return <TrendingUpIcon sx={{ fontSize: 16 }} />;
    if (trend < 0) return <TrendingDownIcon sx={{ fontSize: 16 }} />;
    return <TrendingFlatIcon sx={{ fontSize: 16 }} />;
  };

  const getTrendColor = () => {
    if (trend > 0) return theme.palette.success.main;
    if (trend < 0) return theme.palette.error.main;
    return theme.palette.text.secondary;
  };

  const cardSizes = {
    small: { padding: 2, avatarSize: 40, titleVariant: 'body1', valueVariant: 'h5' },
    medium: { padding: 3, avatarSize: 48, titleVariant: 'h6', valueVariant: 'h4' },
    large: { padding: 4, avatarSize: 56, titleVariant: 'h5', valueVariant: 'h3' },
  };

  const currentSize = cardSizes[size];

  if (loading) {
    return (
      <Card 
        sx={{ 
          height: '100%',
          cursor: onClick ? 'pointer' : 'default',
          transition: animate ? 'all 0.3s ease' : 'none',
        }}
      >
        <CardContent sx={{ p: currentSize.padding }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Skeleton variant="circular" width={currentSize.avatarSize} height={currentSize.avatarSize} />
            <Skeleton variant="rectangular" width={24} height={24} />
          </Box>
          <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="50%" height={16} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: animate ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
        transform: animate ? 'translateY(0)' : 'none',
        boxShadow: theme.shadows[2],
        border: variant === 'outlined' ? `1px solid ${alpha(colorValue, 0.3)}` : 'none',
        background: variant === 'gradient' 
          ? `linear-gradient(135deg, ${alpha(colorValue, 0.1)}, ${alpha(colorValue, 0.05)})`
          : theme.palette.background.paper,
        position: 'relative',
        overflow: 'hidden',
        '&::before': variant === 'gradient' ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${colorValue}, ${alpha(colorValue, 0.7)})`,
        } : {},
        '&:hover': onClick && animate ? {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        } : {},
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: currentSize.padding, position: 'relative' }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          justifyContent: 'space-between', 
          mb: 2 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                bgcolor: alpha(colorValue, 0.1),
                color: colorValue,
                width: currentSize.avatarSize,
                height: currentSize.avatarSize,
                mr: 2,
              }}
            >
              {icon}
            </Avatar>
            {badge && (
              <Chip
                label={badge}
                size="small"
                sx={{
                  bgcolor: alpha(colorValue, 0.1),
                  color: colorValue,
                  fontSize: '0.7rem',
                  height: 20,
                }}
              />
            )}
          </Box>
          
          {actions && (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {actions.map((action, index) => (
                <IconButton
                  key={index}
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick();
                  }}
                  sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
                >
                  {action.icon}
                </IconButton>
              ))}
            </Box>
          )}
        </Box>

        {/* Title */}
        <Typography
          variant={currentSize.titleVariant}
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            mb: 0.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {title}
        </Typography>

        {/* Value */}
        <Typography
          variant={currentSize.valueVariant}
          sx={{
            fontWeight: 'bold',
            color: colorValue,
            mb: subtitle || description ? 1 : 2,
            fontFeatureSettings: '"tnum"',
          }}
        >
          {typeof value === 'number' ? value.toLocaleString() : value}
        </Typography>

        {/* Subtitle */}
        {subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            {subtitle}
          </Typography>
        )}

        {/* Description */}
        {description && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Tooltip title={description}>
              <InfoIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
            </Tooltip>
            <Typography variant="caption" color="text.secondary">
              {description}
            </Typography>
          </Box>
        )}

        {/* Trend */}
        {showTrend && (trend !== undefined || trendValue !== undefined) && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: progress ? 1 : 0 }}>
            {trend !== undefined && getTrendIcon()}
            <Typography
              variant="body2"
              sx={{
                color: getTrendColor(),
                fontWeight: 600,
                ml: trend !== undefined ? 0.5 : 0,
                mr: 1,
              }}
            >
              {trend !== undefined ? `${trend > 0 ? '+' : ''}${trend}%` : ''}
              {trendValue && ` ${trendValue}`}
            </Typography>
            {trendLabel && (
              <Typography variant="caption" color="text.secondary">
                {trendLabel}
              </Typography>
            )}
          </Box>
        )}

        {/* Progress */}
        {progress !== undefined && (
          <Box sx={{ mt: 2 }}>
            {progressLabel && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {progressLabel}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {progress}%
                </Typography>
              </Box>
            )}
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: alpha(colorValue, 0.1),
                '& .MuiLinearProgress-bar': {
                  bgcolor: colorValue,
                  borderRadius: 3,
                },
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// Predefined stats card variants for common use cases
export const RevenueStatsCard = (props) => (
  <UniversalStatsCard
    icon="💰"
    color="success"
    variant="gradient"
    {...props}
  />
);

export const OrdersStatsCard = (props) => (
  <UniversalStatsCard
    icon="📋"
    color="primary"
    variant="gradient"
    {...props}
  />
);

export const CustomersStatsCard = (props) => (
  <UniversalStatsCard
    icon="👥"
    color="info"
    variant="gradient"
    {...props}
  />
);

export const InventoryStatsCard = (props) => (
  <UniversalStatsCard
    icon="📦"
    color="warning"
    variant="gradient"
    {...props}
  />
);

export const AppointmentsStatsCard = (props) => (
  <UniversalStatsCard
    icon="📅"
    color="secondary"
    variant="gradient"
    {...props}
  />
);

export default UniversalStatsCard;