// src/pages/ApiTest.jsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  CircularProgress,
  Chip,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  PlayArrow as RunIcon,
  Assessment as ReportIcon,
} from '@mui/icons-material';
import apiTestService from '../services/api-test.service';

const ApiTest = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [report, setReport] = useState(null);

  const runTests = async () => {
    setLoading(true);
    setResults(null);
    setReport(null);

    try {
      console.log('🚀 Iniciando tests de API...');
      const testResults = await apiTestService.runAllTests();
      setResults(testResults);
      
      const testReport = apiTestService.generateReport(testResults);
      setReport(testReport);
      
      // También imprimir en consola
      apiTestService.printReport(testResults);
      
    } catch (error) {
      console.error('Error ejecutando tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (success) => {
    return success ? 'success' : 'error';
  };

  const getStatusIcon = (success) => {
    return success ? <CheckIcon color="success" /> : <ErrorIcon color="error" />;
  };

  const renderServiceTests = (serviceName, serviceTests) => {
    return (
      <Accordion key={serviceName}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h6">
              {serviceName.charAt(0).toUpperCase() + serviceName.slice(1)} Service
            </Typography>
            <Chip 
              label={`${Object.keys(serviceTests).length} tests`}
              size="small"
              variant="outlined"
            />
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {Object.entries(serviceTests).map(([testName, testResult]) => (
              <ListItem key={testName}>
                <ListItemIcon>
                  {getStatusIcon(testResult.success)}
                </ListItemIcon>
                <ListItemText
                  primary={testName}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        {testResult.message}
                      </Typography>
                      {!testResult.success && testResult.error && (
                        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                          Error: {testResult.error}
                        </Typography>
                      )}
                      {testResult.success && testResult.result && (
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                          Resultado: {typeof testResult.result === 'object' 
                            ? `${Array.isArray(testResult.result) ? testResult.result.length : Object.keys(testResult.result).length} items`
                            : testResult.result}
                        </Typography>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        🧪 Pruebas de Integración API
      </Typography>
      
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Esta página permite probar todas las integraciones con el backend para verificar que las APIs funcionan correctamente.
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={loading ? <CircularProgress size={20} /> : <RunIcon />}
          onClick={runTests}
          disabled={loading}
          sx={{ mr: 2 }}
        >
          {loading ? 'Ejecutando Tests...' : 'Ejecutar Todos los Tests'}
        </Button>
        
        {report && (
          <Button
            variant="outlined"
            startIcon={<ReportIcon />}
            onClick={() => console.log('Reporte completo:', report)}
          >
            Ver Reporte Completo en Consola
          </Button>
        )}
      </Box>

      {/* Resumen de resultados */}
      {report && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            📊 Resumen de Resultados
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h4" color="primary">
                    {report.summary.totalServices}
                  </Typography>
                  <Typography variant="body2">
                    Servicios Probados
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h4" color="primary">
                    {report.summary.totalTests}
                  </Typography>
                  <Typography variant="body2">
                    Tests Ejecutados
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h4" color="success.main">
                    {report.summary.successfulTests}
                  </Typography>
                  <Typography variant="body2">
                    Tests Exitosos
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h4" color="error.main">
                    {report.summary.failedTests}
                  </Typography>
                  <Typography variant="body2">
                    Tests Fallidos
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 2 }}>
            <Alert 
              severity={report.summary.successRate >= 80 ? 'success' : report.summary.successRate >= 60 ? 'warning' : 'error'}
            >
              <Typography variant="h6">
                Tasa de Éxito: {report.summary.successRate}%
              </Typography>
              <Typography variant="body2">
                {report.summary.successRate >= 80 
                  ? '¡Excelente! La mayoría de las APIs están funcionando correctamente.'
                  : report.summary.successRate >= 60
                  ? 'Algunas APIs tienen problemas. Revisa los errores detallados.'
                  : 'Múltiples APIs están fallando. Verifica la conexión con el backend.'}
              </Typography>
            </Alert>
          </Box>
        </Paper>
      )}

      {/* Resultados detallados */}
      {results && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            📋 Resultados Detallados
          </Typography>
          
          {Object.entries(results).map(([serviceName, serviceTests]) =>
            renderServiceTests(serviceName, serviceTests)
          )}
        </Paper>
      )}

      {/* Información de ayuda */}
      <Paper sx={{ p: 3, mt: 3, bgcolor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom>
          💡 Información de Ayuda
        </Typography>
        
        <Typography variant="body2" paragraph>
          <strong>¿Cómo interpretar los resultados?</strong>
        </Typography>
        
        <List dense>
          <ListItem>
            <ListItemIcon>
              <CheckIcon color="success" />
            </ListItemIcon>
            <ListItemText 
              primary="Tests exitosos"
              secondary="La API responde correctamente y devuelve datos válidos"
            />
          </ListItem>
          
          <ListItem>
            <ListItemIcon>
              <ErrorIcon color="error" />
            </ListItemIcon>
            <ListItemText 
              primary="Tests fallidos"
              secondary="La API no está disponible, devuelve un error, o los datos no son válidos"
            />
          </ListItem>
        </List>
        
        <Typography variant="body2" paragraph sx={{ mt: 2 }}>
          <strong>Errores comunes:</strong>
        </Typography>
        
        <Typography variant="body2" component="div">
          • <strong>Network Error:</strong> El backend no está ejecutándose en localhost:8000<br/>
          • <strong>401 Unauthorized:</strong> No estás autenticado o tu token expiró<br/>
          • <strong>403 Forbidden:</strong> No tienes permisos para acceder a la API<br/>
          • <strong>404 Not Found:</strong> El endpoint no existe en el backend<br/>
          • <strong>500 Server Error:</strong> Error interno del servidor
        </Typography>
      </Paper>
    </Box>
  );
};

export default ApiTest;