// src/services/api-test.service.js
import authService from './auth.service';
import businessService from './business.service';
import postService from './post.service';
import ordersService from './orders.service';
import inventoryService from './inventory.service';
import rolesService from './roles.service';
import settingsService from './settings.service';

/**
 * Servicio para probar todas las integraciones de API
 */
const apiTestService = {
  /**
   * Ejecuta todos los tests de API
   * @returns {Promise<Object>} Resultados de todos los tests
   */
  async runAllTests() {
    console.log('🧪 Iniciando tests de API...');
    
    const results = {
      auth: await this.testAuthService(),
      business: await this.testBusinessService(),
      posts: await this.testPostService(),
      orders: await this.testOrdersService(),
      inventory: await this.testInventoryService(),
      roles: await this.testRolesService(),
      settings: await this.testSettingsService(),
    };

    console.log('✅ Tests de API completados:', results);
    return results;
  },

  /**
   * Test del servicio de autenticación
   */
  async testAuthService() {
    const tests = {};
    
    try {
      // Test 1: Verificar si está autenticado
      tests.isAuthenticated = {
        success: true,
        result: authService.isAuthenticated(),
        message: 'Verificación de autenticación'
      };

      // Test 2: Obtener usuario actual (si está autenticado)
      if (authService.isAuthenticated()) {
        tests.getCurrentUser = {
          success: true,
          result: authService.getCurrentUser(),
          message: 'Obtener usuario actual'
        };

        // Test 3: Obtener info actualizada del usuario
        try {
          const userInfo = await authService.getUserInfo();
          tests.getUserInfo = {
            success: true,
            result: userInfo,
            message: 'Obtener información actualizada del usuario'
          };
        } catch (error) {
          tests.getUserInfo = {
            success: false,
            error: error.message,
            message: 'Error al obtener información del usuario'
          };
        }

        // Test 4: Obtener perfiles de negocio
        try {
          const profiles = await authService.getBusinessProfiles();
          tests.getBusinessProfiles = {
            success: true,
            result: profiles,
            message: 'Obtener perfiles de negocio'
          };
        } catch (error) {
          tests.getBusinessProfiles = {
            success: false,
            error: error.message,
            message: 'Error al obtener perfiles de negocio'
          };
        }
      }

    } catch (error) {
      tests.general = {
        success: false,
        error: error.message,
        message: 'Error general en auth service'
      };
    }

    return tests;
  },

  /**
   * Test del servicio de negocios
   */
  async testBusinessService() {
    const tests = {};

    try {
      // Test 1: Obtener negocios del usuario
      try {
        const businesses = await businessService.getUserBusinesses();
        tests.getUserBusinesses = {
          success: true,
          result: businesses,
          message: 'Obtener negocios del usuario'
        };
      } catch (error) {
        tests.getUserBusinesses = {
          success: false,
          error: error.message,
          message: 'Error al obtener negocios del usuario'
        };
      }

      // Test 2: Buscar negocios
      try {
        const searchResults = await businessService.searchBusinesses('test');
        tests.searchBusinesses = {
          success: true,
          result: searchResults,
          message: 'Buscar negocios'
        };
      } catch (error) {
        tests.searchBusinesses = {
          success: false,
          error: error.message,
          message: 'Error al buscar negocios'
        };
      }

      // Test 3: Obtener invitaciones
      try {
        const invitations = await businessService.getInvitations();
        tests.getInvitations = {
          success: true,
          result: invitations,
          message: 'Obtener invitaciones'
        };
      } catch (error) {
        tests.getInvitations = {
          success: false,
          error: error.message,
          message: 'Error al obtener invitaciones'
        };
      }

    } catch (error) {
      tests.general = {
        success: false,
        error: error.message,
        message: 'Error general en business service'
      };
    }

    return tests;
  },

  /**
   * Test del servicio de posts
   */
  async testPostService() {
    const tests = {};

    try {
      // Test 1: Obtener feed
      try {
        const feed = await postService.getFeed();
        tests.getFeed = {
          success: true,
          result: feed,
          message: 'Obtener feed de publicaciones'
        };
      } catch (error) {
        tests.getFeed = {
          success: false,
          error: error.message,
          message: 'Error al obtener feed'
        };
      }

    } catch (error) {
      tests.general = {
        success: false,
        error: error.message,
        message: 'Error general en post service'
      };
    }

    return tests;
  },

  /**
   * Test del servicio de órdenes
   */
  async testOrdersService() {
    const tests = {};

    try {
      // Test 1: Obtener órdenes
      try {
        const orders = await ordersService.getOrders();
        tests.getOrders = {
          success: true,
          result: orders,
          message: 'Obtener todas las órdenes'
        };
      } catch (error) {
        tests.getOrders = {
          success: false,
          error: error.message,
          message: 'Error al obtener órdenes'
        };
      }

      // Test 2: Obtener órdenes pendientes
      try {
        const pendingOrders = await ordersService.getPendingOrders();
        tests.getPendingOrders = {
          success: true,
          result: pendingOrders,
          message: 'Obtener órdenes pendientes'
        };
      } catch (error) {
        tests.getPendingOrders = {
          success: false,
          error: error.message,
          message: 'Error al obtener órdenes pendientes'
        };
      }

      // Test 3: Obtener estadísticas
      try {
        const stats = await ordersService.getOrderStatistics();
        tests.getOrderStatistics = {
          success: true,
          result: stats,
          message: 'Obtener estadísticas de órdenes'
        };
      } catch (error) {
        tests.getOrderStatistics = {
          success: false,
          error: error.message,
          message: 'Error al obtener estadísticas'
        };
      }

    } catch (error) {
      tests.general = {
        success: false,
        error: error.message,
        message: 'Error general en orders service'
      };
    }

    return tests;
  },

  /**
   * Test del servicio de inventario
   */
  async testInventoryService() {
    const tests = {};

    try {
      // Test 1: Obtener productos
      try {
        const products = await inventoryService.getProducts();
        tests.getProducts = {
          success: true,
          result: products,
          message: 'Obtener productos del inventario'
        };
      } catch (error) {
        tests.getProducts = {
          success: false,
          error: error.message,
          message: 'Error al obtener productos'
        };
      }

      // Test 2: Obtener categorías
      try {
        const categories = await inventoryService.getCategories();
        tests.getCategories = {
          success: true,
          result: categories,
          message: 'Obtener categorías'
        };
      } catch (error) {
        tests.getCategories = {
          success: false,
          error: error.message,
          message: 'Error al obtener categorías'
        };
      }

      // Test 3: Obtener movimientos de stock
      try {
        const movements = await inventoryService.getStockMovements();
        tests.getStockMovements = {
          success: true,
          result: movements,
          message: 'Obtener movimientos de stock'
        };
      } catch (error) {
        tests.getStockMovements = {
          success: false,
          error: error.message,
          message: 'Error al obtener movimientos de stock'
        };
      }

    } catch (error) {
      tests.general = {
        success: false,
        error: error.message,
        message: 'Error general en inventory service'
      };
    }

    return tests;
  },

  /**
   * Test del servicio de roles
   */
  async testRolesService() {
    const tests = {};

    try {
      // Test 1: Obtener roles
      try {
        const roles = await rolesService.getRoles();
        tests.getRoles = {
          success: true,
          result: roles,
          message: 'Obtener roles'
        };
      } catch (error) {
        tests.getRoles = {
          success: false,
          error: error.message,
          message: 'Error al obtener roles'
        };
      }

      // Test 2: Obtener permisos del usuario
      try {
        const permissions = await rolesService.getUserPermissions();
        tests.getUserPermissions = {
          success: true,
          result: permissions,
          message: 'Obtener permisos del usuario'
        };
      } catch (error) {
        tests.getUserPermissions = {
          success: false,
          error: error.message,
          message: 'Error al obtener permisos'
        };
      }

      // Test 3: Obtener plantillas de roles
      try {
        const templates = await rolesService.getRoleTemplates();
        tests.getRoleTemplates = {
          success: true,
          result: templates,
          message: 'Obtener plantillas de roles'
        };
      } catch (error) {
        tests.getRoleTemplates = {
          success: false,
          error: error.message,
          message: 'Error al obtener plantillas'
        };
      }

    } catch (error) {
      tests.general = {
        success: false,
        error: error.message,
        message: 'Error general en roles service'
      };
    }

    return tests;
  },

  /**
   * Test del servicio de configuraciones
   */
  async testSettingsService() {
    const tests = {};

    try {
      // Test 1: Obtener configuraciones de usuario
      try {
        const userSettings = await settingsService.getUserSettings();
        tests.getUserSettings = {
          success: true,
          result: userSettings,
          message: 'Obtener configuraciones de usuario'
        };
      } catch (error) {
        tests.getUserSettings = {
          success: false,
          error: error.message,
          message: 'Error al obtener configuraciones de usuario'
        };
      }

      // Test 2: Obtener configuraciones de negocio
      try {
        const businessSettings = await settingsService.getBusinessSettings();
        tests.getBusinessSettings = {
          success: true,
          result: businessSettings,
          message: 'Obtener configuraciones de negocio'
        };
      } catch (error) {
        tests.getBusinessSettings = {
          success: false,
          error: error.message,
          message: 'Error al obtener configuraciones de negocio'
        };
      }

      // Test 3: Obtener resumen de configuraciones
      try {
        const summary = await settingsService.getSettingsSummary();
        tests.getSettingsSummary = {
          success: true,
          result: summary,
          message: 'Obtener resumen de configuraciones'
        };
      } catch (error) {
        tests.getSettingsSummary = {
          success: false,
          error: error.message,
          message: 'Error al obtener resumen'
        };
      }

    } catch (error) {
      tests.general = {
        success: false,
        error: error.message,
        message: 'Error general en settings service'
      };
    }

    return tests;
  },

  /**
   * Genera un reporte de los resultados de los tests
   * @param {Object} results - Resultados de los tests
   * @returns {Object} Reporte formateado
   */
  generateReport(results) {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalServices: 0,
        totalTests: 0,
        successfulTests: 0,
        failedTests: 0,
        successRate: 0
      },
      details: {}
    };

    // Calcular estadísticas
    Object.keys(results).forEach(service => {
      report.summary.totalServices++;
      const serviceTests = results[service];
      
      Object.keys(serviceTests).forEach(test => {
        report.summary.totalTests++;
        if (serviceTests[test].success) {
          report.summary.successfulTests++;
        } else {
          report.summary.failedTests++;
        }
      });

      report.details[service] = serviceTests;
    });

    // Calcular tasa de éxito
    if (report.summary.totalTests > 0) {
      report.summary.successRate = (report.summary.successfulTests / report.summary.totalTests * 100).toFixed(2);
    }

    return report;
  },

  /**
   * Imprime un reporte legible en consola
   * @param {Object} results - Resultados de los tests
   */
  printReport(results) {
    const report = this.generateReport(results);
    
    console.log('\n🔍 REPORTE DE TESTS DE API');
    console.log('=' * 50);
    console.log(`📅 Timestamp: ${report.timestamp}`);
    console.log(`🎯 Servicios probados: ${report.summary.totalServices}`);
    console.log(`🧪 Tests ejecutados: ${report.summary.totalTests}`);
    console.log(`✅ Tests exitosos: ${report.summary.successfulTests}`);
    console.log(`❌ Tests fallidos: ${report.summary.failedTests}`);
    console.log(`📊 Tasa de éxito: ${report.summary.successRate}%`);
    
    console.log('\n📋 DETALLES POR SERVICIO:');
    Object.keys(report.details).forEach(service => {
      console.log(`\n🔧 ${service.toUpperCase()}:`);
      Object.keys(report.details[service]).forEach(test => {
        const testResult = report.details[service][test];
        const icon = testResult.success ? '✅' : '❌';
        console.log(`  ${icon} ${test}: ${testResult.message}`);
        if (!testResult.success && testResult.error) {
          console.log(`     Error: ${testResult.error}`);
        }
      });
    });
    
    console.log('\n' + '=' * 50);
  }
};

export default apiTestService;