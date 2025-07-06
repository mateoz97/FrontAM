// src/components/payments/PaymentSystem.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { PAYMENTS } from '../../config/constants';
import { getBusinessPaymentTypes } from '../../utils/businessTypes';

const PaymentSystem = ({ 
  businessType = 'restaurant',
  onPaymentComplete,
  onPaymentError,
  embedded = false 
}) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('process');
  const [paymentData, setPaymentData] = useState({
    amount: '',
    method: '',
    reference: '',
    description: '',
    currency: 'MXN',
  });
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  const availablePaymentMethods = getBusinessPaymentTypes(businessType);

  const tabs = [
    { id: 'process', label: 'Procesar Pago', icon: <PaymentIcon /> },
    { id: 'history', label: 'Historial', icon: <HistoryIcon /> },
    { id: 'settings', label: 'Configuración', icon: <SettingsIcon /> },
  ];

  const handleInputChange = (field, value) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  const handleProcessPayment = async () => {
    if (!paymentData.amount || !paymentData.method) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const transaction = {
        id: Date.now(),
        amount: parseFloat(paymentData.amount),
        method: paymentData.method,
        reference: paymentData.reference || `TXN-${Date.now()}`,
        description: paymentData.description,
        currency: paymentData.currency,
        status: 'completed',
        timestamp: new Date(),
      };

      setTransactions(prev => [transaction, ...prev]);
      setPaymentData({
        amount: '',
        method: '',
        reference: '',
        description: '',
        currency: 'MXN',
      });

      if (onPaymentComplete) {
        onPaymentComplete(transaction);
      }
    } catch (err) {
      setError('Error al procesar el pago. Intenta nuevamente.');
      if (onPaymentError) {
        onPaymentError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    return PAYMENTS.STATUS_COLORS[status] || theme.palette.grey[500];
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      completed: <CheckCircleIcon />,
      failed: <ErrorIcon />,
      pending: <ScheduleIcon />,
      processing: <CircularProgress size={20} />,
    };
    return iconMap[status] || <ScheduleIcon />;
  };

  const formatCurrency = (amount, currency = 'MXN') => {
    const symbol = PAYMENTS.CURRENCY_SYMBOLS[currency] || '$';
    return `${symbol}${amount.toFixed(2)}`;
  };

  const PaymentProcessTab = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <PaymentIcon sx={{ mr: 1 }} />
          Procesar Pago
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Monto"
              type="number"
              value={paymentData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
              }}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Método de Pago</InputLabel>
              <Select
                value={paymentData.method}
                onChange={(e) => handleInputChange('method', e.target.value)}
                label="Método de Pago"
              >
                {availablePaymentMethods.map(method => (
                  <MenuItem key={method} value={method}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ mr: 1 }}>
                        {PAYMENTS.METHOD_ICONS[method]}
                      </Typography>
                      {PAYMENTS.METHOD_LABELS[method]}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Referencia"
              value={paymentData.reference}
              onChange={(e) => handleInputChange('reference', e.target.value)}
              placeholder="Opcional"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Moneda</InputLabel>
              <Select
                value={paymentData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                label="Moneda"
              >
                {Object.entries(PAYMENTS.CURRENCIES).map(([key, value]) => (
                  <MenuItem key={key} value={value}>
                    {PAYMENTS.CURRENCY_SYMBOLS[value]} {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descripción"
              multiline
              rows={2}
              value={paymentData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descripción del pago (opcional)"
            />
          </Grid>

          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}

          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleProcessPayment}
              disabled={loading || !paymentData.amount || !paymentData.method}
              sx={{ py: 1.5 }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ mr: 1 }} />
              ) : (
                <PaymentIcon sx={{ mr: 1 }} />
              )}
              {loading ? 'Procesando...' : 'Procesar Pago'}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const PaymentHistoryTab = () => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            <HistoryIcon sx={{ mr: 1 }} />
            Historial de Pagos
          </Typography>
          <IconButton onClick={() => {}}>
            <RefreshIcon />
          </IconButton>
        </Box>

        {transactions.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <ReceiptIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No hay transacciones
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Los pagos procesados aparecerán aquí
            </Typography>
          </Box>
        ) : (
          <List>
            {transactions.map((transaction, index) => (
              <React.Fragment key={transaction.id}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1" sx={{ mr: 1 }}>
                          {formatCurrency(transaction.amount, transaction.currency)}
                        </Typography>
                        <Chip
                          size="small"
                          label={PAYMENTS.STATUS_LABELS[transaction.status]}
                          sx={{
                            backgroundColor: getStatusColor(transaction.status),
                            color: 'white',
                            fontSize: '0.75rem',
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {PAYMENTS.METHOD_ICONS[transaction.method]} {PAYMENTS.METHOD_LABELS[transaction.method]}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {transaction.reference} • {transaction.timestamp.toLocaleString()}
                        </Typography>
                        {transaction.description && (
                          <Typography variant="body2" color="text.secondary">
                            {transaction.description}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    {getStatusIcon(transaction.status)}
                  </ListItemSecondaryAction>
                </ListItem>
                {index < transactions.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );

  const PaymentSettingsTab = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <SettingsIcon sx={{ mr: 1 }} />
          Configuración de Pagos
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Métodos de Pago Disponibles
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {availablePaymentMethods.map(method => (
                <Chip
                  key={method}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ mr: 0.5 }}>
                        {PAYMENTS.METHOD_ICONS[method]}
                      </Typography>
                      {PAYMENTS.METHOD_LABELS[method]}
                    </Box>
                  }
                  variant="outlined"
                  sx={{ borderColor: theme.palette.primary.main }}
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Alert severity="info">
              Los métodos de pago disponibles se configuran automáticamente según el tipo de negocio.
              Para modificar estas opciones, contacta con el administrador.
            </Alert>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'process':
        return <PaymentProcessTab />;
      case 'history':
        return <PaymentHistoryTab />;
      case 'settings':
        return <PaymentSettingsTab />;
      default:
        return <PaymentProcessTab />;
    }
  };

  if (embedded) {
    return <PaymentProcessTab />;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 1, overflow: 'auto' }}>
          {tabs.map(tab => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'contained' : 'text'}
              onClick={() => setActiveTab(tab.id)}
              startIcon={tab.icon}
              sx={{ minWidth: 'auto', whiteSpace: 'nowrap' }}
            >
              {tab.label}
            </Button>
          ))}
        </Box>
      </Box>

      {renderTabContent()}
    </Box>
  );
};

export default PaymentSystem;