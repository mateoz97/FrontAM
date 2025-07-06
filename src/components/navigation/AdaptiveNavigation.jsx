// src/components/navigation/AdaptiveNavigation.jsx
import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Collapse,
  Box,
  Typography,
  Avatar,
  Chip,
  Divider,
  Badge,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  Dashboard as DashboardIcon,
  Home as HomeIcon,
  ShoppingCart as OrdersIcon,
  Inventory as InventoryIcon,
  EventNote as ReservationsIcon,
  Restaurant as MenuIcon,
  TableChart as TablesIcon,
  LocalShipping as DeliveryIcon,
  Factory as ProductionIcon,
  PointOfSale as PosIcon,
  Store as SuppliersIcon,
  LocalPharmacy as PrescriptionsIcon,
  People as ClientsIcon,
  Group as StaffIcon,
  CardMembership as MembershipsIcon,
  FitnessCenter as ClassesIcon,
  Build as EquipmentIcon,
  SportsGymnastics as TrainersIcon,
  RequestQuote as QuotesIcon,
  School as StudentsIcon,
  Person as TeachersIcon,
  MenuBook as CoursesIcon,
  LocalHospital as PatientsIcon,
  Description as MedicalRecordsIcon,
  Handyman as ServicesIcon,
  Home as PropertiesIcon,
  Assignment as ContractsIcon,
  Computer as ProjectsIcon,
  LocationOn as LocationIcon,
  Payment as PaymentsIcon,
  Settings as SettingsIcon,
  Person as ProfileIcon,
  ExitToApp as LogoutIcon,
  Help as HelpIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getBusinessTypeNavigation, 
  getBusinessTypeLabel, 
  getBusinessTypeIcon, 
  getBusinessTypeColor 
} from '../../utils/businessTypes';

const AdaptiveNavigation = ({ open, onClose, width = 280 }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { user, activeBusiness, logout } = useAuth();
  const [expandedSections, setExpandedSections] = useState({
    business: true,
    account: false,
  });

  const businessType = activeBusiness?.business_type || activeBusiness?.type || 'restaurant';
  const businessTypeLabel = getBusinessTypeLabel(businessType);
  const businessTypeIcon = getBusinessTypeIcon(businessType);
  const businessTypeColor = getBusinessTypeColor(businessType);

  // Icons map for navigation items
  const iconMap = {
    orders: <OrdersIcon />,
    inventory: <InventoryIcon />,
    reservations: <ReservationsIcon />,
    appointments: <ReservationsIcon />,
    menu: <MenuIcon />,
    tables: <TablesIcon />,
    delivery: <DeliveryIcon />,
    production: <ProductionIcon />,
    pos: <PosIcon />,
    suppliers: <SuppliersIcon />,
    prescriptions: <PrescriptionsIcon />,
    clients: <ClientsIcon />,
    staff: <StaffIcon />,
    memberships: <MembershipsIcon />,
    classes: <ClassesIcon />,
    equipment: <EquipmentIcon />,
    trainers: <TrainersIcon />,
    quotes: <QuotesIcon />,
    students: <StudentsIcon />,
    teachers: <TeachersIcon />,
    courses: <CoursesIcon />,
    patients: <PatientsIcon />,
    medical_records: <MedicalRecordsIcon />,
    services: <ServicesIcon />,
    properties: <PropertiesIcon />,
    contracts: <ContractsIcon />,
    projects: <ProjectsIcon />,
    location: <LocationIcon />,
  };

  // Core navigation items (always available)
  const coreNavItems = [
    { label: 'Feed Social', path: '/', icon: <HomeIcon />, exact: true },
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  ];

  // Get business-specific navigation
  const businessNavItems = getBusinessTypeNavigation(businessType).map(item => ({
    ...item,
    icon: iconMap[item.path.slice(1)] || <ServicesIcon />,
  }));

  // System navigation items
  const systemNavItems = [
    { label: 'Pagos', path: '/payments', icon: <PaymentsIcon /> },
    { label: 'Usuarios', path: '/users', icon: <StaffIcon /> },
    { label: 'Configuración', path: '/settings', icon: <SettingsIcon /> },
  ];

  // Account navigation items
  const accountNavItems = [
    { label: 'Mi Perfil', path: '/profile', icon: <ProfileIcon /> },
    { label: 'Ayuda', path: '/help', icon: <HelpIcon /> },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const handleSectionToggle = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActiveRoute = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const NavigationSection = ({ title, items, expanded, onToggle, sectionKey }) => (
    <>
      <ListItem>
        <ListItemButton onClick={() => onToggle(sectionKey)} sx={{ borderRadius: 2 }}>
          <ListItemText
            primary={
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                {title}
              </Typography>
            }
          />
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {items.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ pl: 1 }}>
              <ListItemButton
                onClick={() => handleNavigate(item.path)}
                selected={isActiveRoute(item.path, item.exact)}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  '&.Mui-selected': {
                    bgcolor: alpha(businessTypeColor, 0.1),
                    color: businessTypeColor,
                    '&:hover': {
                      bgcolor: alpha(businessTypeColor, 0.15),
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActiveRoute(item.path, item.exact) ? businessTypeColor : 'inherit',
                    minWidth: 40,
                  }}
                >
                  {item.badge ? (
                    <Badge badgeContent={item.badge} color="error">
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontWeight: isActiveRoute(item.path, item.exact) ? 600 : 400,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Collapse>
    </>
  );

  const BusinessHeader = () => (
    <Box
      sx={{
        p: 3,
        background: `linear-gradient(135deg, ${businessTypeColor}, ${alpha(businessTypeColor, 0.8)})`,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: 100,
          height: 100,
          background: `radial-gradient(circle, ${alpha('#fff', 0.1)}, transparent)`,
          transform: 'translate(20px, -20px)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, position: 'relative', zIndex: 1 }}>
        <Avatar
          sx={{
            width: 56,
            height: 56,
            bgcolor: alpha('#fff', 0.2),
            color: 'white',
            mr: 2,
            fontSize: '1.5rem',
          }}
        >
          {businessTypeIcon}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.2,
            }}
          >
            {activeBusiness?.name || 'Mi Negocio'}
          </Typography>
          <Chip
            label={businessTypeLabel}
            size="small"
            sx={{
              bgcolor: alpha('#fff', 0.2),
              color: 'white',
              fontSize: '0.75rem',
              height: 24,
              mt: 0.5,
            }}
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: alpha('#fff', 0.2),
            color: 'white',
            mr: 1,
            fontSize: '0.9rem',
          }}
        >
          {user?.first_name?.charAt(0) || 'U'}
        </Avatar>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {user?.first_name} {user?.last_name}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            {activeBusiness?.role || 'Usuario'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        width: width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: width,
          boxSizing: 'border-box',
          border: 'none',
          boxShadow: theme.shadows[8],
        },
      }}
    >
      {/* Business Header */}
      <BusinessHeader />

      {/* Navigation Content */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ p: 2 }}>
          {/* Core Navigation */}
          {coreNavItems.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigate(item.path)}
                selected={isActiveRoute(item.path, item.exact)}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: alpha(businessTypeColor, 0.1),
                    color: businessTypeColor,
                    '&:hover': {
                      bgcolor: alpha(businessTypeColor, 0.15),
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActiveRoute(item.path, item.exact) ? businessTypeColor : 'inherit',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontWeight: isActiveRoute(item.path, item.exact) ? 600 : 400,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}

          <Divider sx={{ my: 2 }} />

          {/* Business-specific Navigation */}
          {businessNavItems.length > 0 && (
            <NavigationSection
              title={`Gestión ${businessTypeLabel}`}
              items={businessNavItems}
              expanded={expandedSections.business}
              onToggle={handleSectionToggle}
              sectionKey="business"
            />
          )}

          {businessNavItems.length > 0 && <Divider sx={{ my: 2 }} />}

          {/* System Navigation */}
          {systemNavItems.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigate(item.path)}
                selected={isActiveRoute(item.path)}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: alpha(businessTypeColor, 0.1),
                    color: businessTypeColor,
                    '&:hover': {
                      bgcolor: alpha(businessTypeColor, 0.15),
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActiveRoute(item.path) ? businessTypeColor : 'inherit',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontWeight: isActiveRoute(item.path) ? 600 : 400,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}

          <Divider sx={{ my: 2 }} />

          {/* Account Navigation */}
          <NavigationSection
            title="Cuenta"
            items={accountNavItems}
            expanded={expandedSections.account}
            onToggle={handleSectionToggle}
            sectionKey="account"
          />
        </List>
      </Box>

      {/* Footer Actions */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              color: 'error.main',
              '&:hover': {
                bgcolor: alpha(theme.palette.error.main, 0.05),
              },
            }}
          >
            <ListItemIcon sx={{ color: 'error.main' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Cerrar Sesión" />
          </ListItemButton>
        </ListItem>
      </Box>
    </Drawer>
  );
};

export default AdaptiveNavigation;