// src/components/business/BusinessTypeSelector.jsx
import React, { useState, useMemo } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Chip,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { getBusinessTypeOptions, getBusinessTypeSuggestions } from '../../utils/businessTypes';

const BusinessTypeSelector = ({ 
  selectedType, 
  onTypeSelect, 
  disabled = false,
  showSearch = true,
  gridColumns = { xs: 1, sm: 2, md: 3, lg: 4 }
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchTerm, setSearchTerm] = useState('');

  const businessTypes = useMemo(() => {
    if (!searchTerm) return getBusinessTypeOptions();
    return getBusinessTypeSuggestions(searchTerm);
  }, [searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTypeSelect = (type) => {
    if (disabled) return;
    onTypeSelect(type);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {showSearch && (
        <TextField
          fullWidth
          placeholder="Buscar tipo de negocio..."
          value={searchTerm}
          onChange={handleSearch}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      )}

      <Grid container spacing={2}>
        {businessTypes.map((type) => (
          <Grid key={type.value} item {...gridColumns}>
            <BusinessTypeCard
              type={type}
              selected={selectedType === type.value}
              onClick={() => handleTypeSelect(type.value)}
              disabled={disabled}
              isMobile={isMobile}
            />
          </Grid>
        ))}
      </Grid>

      {businessTypes.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 4,
            color: 'text.secondary',
          }}
        >
          <Typography variant="body1">
            No se encontraron tipos de negocio que coincidan con tu búsqueda
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Intenta con otros términos o selecciona "Otro" para un negocio personalizado
          </Typography>
        </Box>
      )}
    </Box>
  );
};

const BusinessTypeCard = ({ type, selected, onClick, disabled, isMobile }) => {
  const theme = useTheme();

  const cardStyles = {
    height: '100%',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'visible',
    border: selected ? `2px solid ${type.color}` : '1px solid',
    borderColor: selected ? type.color : 'divider',
    backgroundColor: selected 
      ? alpha(type.color, 0.05)
      : theme.palette.background.paper,
    boxShadow: selected 
      ? `0 8px 32px ${alpha(type.color, 0.2)}`
      : theme.shadows[1],
    '&:hover': disabled ? {} : {
      transform: 'translateY(-4px)',
      boxShadow: selected 
        ? `0 12px 40px ${alpha(type.color, 0.3)}`
        : theme.shadows[4],
      backgroundColor: selected 
        ? alpha(type.color, 0.1)
        : alpha(theme.palette.action.hover, 0.04),
    },
    '&:active': disabled ? {} : {
      transform: 'translateY(-2px)',
    },
  };

  const iconStyles = {
    fontSize: isMobile ? '2rem' : '2.5rem',
    mb: 1,
    filter: selected ? 'brightness(1.2)' : 'brightness(0.9)',
    transition: 'filter 0.3s ease',
  };

  return (
    <Card 
      sx={cardStyles}
      onClick={onClick}
      elevation={0}
    >
      <CardContent 
        sx={{ 
          textAlign: 'center', 
          p: isMobile ? 2 : 3,
          pb: `${isMobile ? 2 : 3}px !important`,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box sx={iconStyles}>
          {type.icon}
        </Box>
        
        <Typography 
          variant={isMobile ? 'body1' : 'h6'} 
          sx={{ 
            fontWeight: selected ? 600 : 500,
            color: selected ? type.color : 'text.primary',
            transition: 'color 0.3s ease',
            mb: selected ? 1 : 0,
          }}
        >
          {type.label}
        </Typography>

        {selected && (
          <Chip
            label="Seleccionado"
            size="small"
            sx={{
              backgroundColor: type.color,
              color: 'white',
              fontSize: '0.75rem',
              height: 24,
              '& .MuiChip-label': {
                px: 1,
              },
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default BusinessTypeSelector;