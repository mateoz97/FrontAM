// src/components/settings/NotificationTemplates.jsx
import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, CardHeader, CardActions,
  Grid, Typography, Button, Box, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem,
  List, ListItem, ListItemText, ListItemIcon, ListItemSecondaryAction,
  IconButton, Chip, Switch, FormControlLabel, Divider,
  Accordion, AccordionSummary, AccordionDetails, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Tabs, Tab
} from '@mui/material';
import {
  Notifications, Add, Edit, Delete, Refresh, Save,
  ExpandMore, ContentCopy, Send, Preview, Settings,
  Email, Sms, Push, Web, CheckCircle, Error
} from '@mui/icons-material';
import settingsService from '../../services/settings.service';

const NotificationTemplates = () => {
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateModal, setTemplateModal] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  const [templateForm, setTemplateForm] = useState({
    name: '',
    description: '',
    type: 'email',
    event_type: 'order_created',
    subject: '',
    content: '',
    is_active: true,
    variables: [],
    conditions: []
  });

  const [testData, setTestData] = useState({
    customer_name: 'Juan Pérez',
    order_number: '12345',
    business_name: 'Mi Restaurante',
    total: '25.50',
    items: 'Pizza Margherita, Coca Cola'
  });

  const eventTypes = [
    { value: 'order_created', label: 'Orden Creada' },
    { value: 'order_confirmed', label: 'Orden Confirmada' },
    { value: 'order_ready', label: 'Orden Lista' },
    { value: 'order_delivered', label: 'Orden Entregada' },
    { value: 'order_cancelled', label: 'Orden Cancelada' },
    { value: 'user_registered', label: 'Usuario Registrado' },
    { value: 'business_created', label: 'Negocio Creado' },
    { value: 'payment_received', label: 'Pago Recibido' }
  ];

  const notificationTypes = [
    { value: 'email', label: 'Email', icon: <Email /> },
    { value: 'sms', label: 'SMS', icon: <Sms /> },
    { value: 'push', label: 'Push Notification', icon: <Push /> },
    { value: 'web', label: 'Web Notification', icon: <Web /> }
  ];

  const availableVariables = [
    '{{customer_name}}',
    '{{order_number}}',
    '{{business_name}}',
    '{{total}}',
    '{{items}}',
    '{{date}}',
    '{{time}}',
    '{{status}}',
    '{{table_number}}',
    '{{estimated_time}}'
  ];

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const result = await settingsService.getNotificationTemplates();
      if (result.success) {
        setTemplates(result.data || []);
      }
    } catch (error) {
      console.error('Error cargando plantillas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setTemplateForm({
      name: '',
      description: '',
      type: 'email',
      event_type: 'order_created',
      subject: '',
      content: '',
      is_active: true,
      variables: [],
      conditions: []
    });
    setTemplateModal(true);
  };

  const handleEditTemplate = (template) => {
    setSelectedTemplate(template);
    setTemplateForm({
      name: template.name || '',
      description: template.description || '',
      type: template.type || 'email',
      event_type: template.event_type || 'order_created',
      subject: template.subject || '',
      content: template.content || '',
      is_active: template.is_active !== false,
      variables: template.variables || [],
      conditions: template.conditions || []
    });
    setTemplateModal(true);
  };

  const handleSaveTemplate = async () => {
    try {
      setLoading(true);
      let result;
      
      if (selectedTemplate) {
        result = await settingsService.updateNotificationTemplate(selectedTemplate.id, templateForm);
      } else {
        result = await settingsService.createNotificationTemplate(templateForm);
      }
      
      if (result.success) {
        setTemplateModal(false);
        await loadTemplates();
      }
    } catch (error) {
      console.error('Error guardando plantilla:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta plantilla?')) {
      return;
    }
    
    try {
      setLoading(true);
      const result = await settingsService.deleteNotificationTemplate(templateId);
      if (result.success) {
        await loadTemplates();
      }
    } catch (error) {
      console.error('Error eliminando plantilla:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDefaults = async () => {
    try {
      setLoading(true);
      const result = await settingsService.createDefaultNotificationTemplates();
      if (result.success) {
        await loadTemplates();
      }
    } catch (error) {
      console.error('Error creando plantillas por defecto:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (template) => {
    setSelectedTemplate(template);
    setPreviewModal(true);
  };

  const handleDuplicate = async (template) => {
    const duplicatedTemplate = {
      ...template,
      name: `${template.name} (Copia)`,
      id: undefined
    };
    
    try {
      setLoading(true);
      const result = await settingsService.createNotificationTemplate(duplicatedTemplate);
      if (result.success) {
        await loadTemplates();
      }
    } catch (error) {
      console.error('Error duplicando plantilla:', error);
    } finally {
      setLoading(false);
    }
  };

  const insertVariable = (variable) => {
    const textarea = document.getElementById('template-content');
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = templateForm.content;
      const before = text.substring(0, start);
      const after = text.substring(end, text.length);
      
      setTemplateForm({
        ...templateForm,
        content: before + variable + after
      });
      
      // Restaurar posición del cursor
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + variable.length;
        textarea.focus();
      }, 10);
    }
  };

  const processTemplate = (content, data) => {
    let processed = content;
    Object.keys(data).forEach(key => {
      const variable = `{{${key}}}`;
      processed = processed.replace(new RegExp(variable, 'g'), data[key]);
    });
    return processed;
  };

  const getTypeIcon = (type) => {
    const typeConfig = notificationTypes.find(t => t.value === type);
    return typeConfig ? typeConfig.icon : <Notifications />;
  };

  const getEventTypeLabel = (eventType) => {
    const event = eventTypes.find(e => e.value === eventType);
    return event ? event.label : eventType;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Notifications />
          Plantillas de Notificaciones
        </Typography>
        <Box>
          <Button
            variant="outlined"
            onClick={handleCreateDefaults}
            disabled={loading}
            sx={{ mr: 1 }}
          >
            Crear Por Defecto
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateTemplate}
          >
            Nueva Plantilla
          </Button>
        </Box>
      </Box>

      {/* Tabs por tipo de notificación */}
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label="Todas" />
        {notificationTypes.map((type, index) => (
          <Tab
            key={type.value}
            label={type.label}
            icon={type.icon}
            iconPosition="start"
          />
        ))}
      </Tabs>

      {/* Lista de Plantillas */}
      <Grid container spacing={3}>
        {templates
          .filter(template => 
            activeTab === 0 || 
            template.type === notificationTypes[activeTab - 1]?.value
          )
          .map((template) => (
            <Grid item xs={12} md={6} lg={4} key={template.id}>
              <Card>
                <CardHeader
                  avatar={getTypeIcon(template.type)}
                  title={template.name}
                  subheader={getEventTypeLabel(template.event_type)}
                  action={
                    <Switch
                      checked={template.is_active !== false}
                      size="small"
                    />
                  }
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {template.description || 'Sin descripción'}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip
                      label={template.type}
                      size="small"
                      color="primary"
                    />
                    <Chip
                      label={template.is_active ? 'Activa' : 'Inactiva'}
                      size="small"
                      color={template.is_active ? 'success' : 'default'}
                    />
                  </Box>
                  
                  {template.subject && (
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Asunto: {template.subject}
                    </Typography>
                  )}
                  
                  <Typography
                    variant="body2"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {template.content}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<Preview />}
                    onClick={() => handlePreview(template)}
                  >
                    Vista Previa
                  </Button>
                  <Button
                    size="small"
                    startIcon={<Edit />}
                    onClick={() => handleEditTemplate(template)}
                  >
                    Editar
                  </Button>
                  <IconButton
                    size="small"
                    onClick={() => handleDuplicate(template)}
                  >
                    <ContentCopy />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteTemplate(template.id)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>

      {templates.length === 0 && !loading && (
        <Alert severity="info" sx={{ mt: 3 }}>
          No hay plantillas de notificación configuradas. 
          Puedes crear plantillas por defecto o crear una nueva.
        </Alert>
      )}

      {/* Modal de Edición/Creación */}
      <Dialog 
        open={templateModal} 
        onClose={() => setTemplateModal(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          {selectedTemplate ? 'Editar Plantilla' : 'Nueva Plantilla'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre"
                value={templateForm.name}
                onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={templateForm.type}
                  label="Tipo"
                  onChange={(e) => setTemplateForm({ ...templateForm, type: e.target.value })}
                >
                  {notificationTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Evento</InputLabel>
                <Select
                  value={templateForm.event_type}
                  label="Evento"
                  onChange={(e) => setTemplateForm({ ...templateForm, event_type: e.target.value })}
                >
                  {eventTypes.map((event) => (
                    <MenuItem key={event.value} value={event.value}>
                      {event.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Descripción"
                value={templateForm.description}
                onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
              />
            </Grid>
            {(templateForm.type === 'email' || templateForm.type === 'push') && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Asunto"
                  value={templateForm.subject}
                  onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
                />
              </Grid>
            )}
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                multiline
                rows={6}
                label="Contenido"
                value={templateForm.content}
                onChange={(e) => setTemplateForm({ ...templateForm, content: e.target.value })}
                id="template-content"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" gutterBottom>
                Variables Disponibles:
              </Typography>
              <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                {availableVariables.map((variable) => (
                  <Button
                    key={variable}
                    size="small"
                    fullWidth
                    variant="outlined"
                    sx={{ mb: 0.5, justifyContent: 'flex-start' }}
                    onClick={() => insertVariable(variable)}
                  >
                    {variable}
                  </Button>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={templateForm.is_active}
                    onChange={(e) => setTemplateForm({ ...templateForm, is_active: e.target.checked })}
                  />
                }
                label="Plantilla Activa"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTemplateModal(false)}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveTemplate}
            disabled={loading}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Vista Previa */}
      <Dialog 
        open={previewModal} 
        onClose={() => setPreviewModal(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>Vista Previa - {selectedTemplate?.name}</DialogTitle>
        <DialogContent>
          {selectedTemplate && (
            <Box>
              {selectedTemplate.subject && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">Asunto:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {processTemplate(selectedTemplate.subject, testData)}
                  </Typography>
                </Box>
              )}
              <Typography variant="subtitle2">Contenido:</Typography>
              <Paper sx={{ p: 2, mt: 1, backgroundColor: 'grey.50' }}>
                <Typography 
                  variant="body1" 
                  sx={{ whiteSpace: 'pre-wrap' }}
                >
                  {processTemplate(selectedTemplate.content, testData)}
                </Typography>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewModal(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NotificationTemplates;