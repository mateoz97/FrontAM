import React from 'react';
import { Box, Card, CardContent, Typography, Zoom } from '@mui/material';
import { Business, Groups, Person } from '@mui/icons-material';

const userTypes = [
  {
    type: 'create',
    icon: <Business sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />,
    title: 'Crear un negocio',
    description: 'Registra tu restaurante y gestiona tu equipo'
  },
  {
    type: 'join',
    icon: <Groups sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />,
    title: 'Unirse a un negocio',
    description: 'Forma parte del equipo de un restaurante existente'
  },
  {
    type: 'client',
    icon: <Person sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />,
    title: 'Soy cliente',
    description: 'Explora restaurantes y disfruta de ofertas exclusivas'
  }
];

const UserTypeStep = ({ onSelectType }) => {
  return (
    <Box>
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ mb: 3, textAlign: 'center' }}
      >
        ¿Cómo quieres usar el sistema?
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
        {userTypes.map((item, index) => (
          <Zoom key={item.type} in={true} timeout={600 + (index * 200)}>
            <Card 
              sx={{ 
                width: 250, 
                cursor: 'pointer',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.05)' }
              }}
              onClick={() => onSelectType(item.type)}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                {item.icon}
                <Typography variant="h6" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          </Zoom>
        ))}
      </Box>
    </Box>
  );
};

export default UserTypeStep;