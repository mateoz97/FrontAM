# API Integration Documentation

## Overview

This document describes the complete integration between the React frontend and Django backend APIs. All services have been implemented to match the backend endpoints.

## Frontend Services Structure

```
src/services/
├── api.js                 # Axios configuration with interceptors
├── auth.service.js        # Authentication & user management
├── business.service.js    # Business operations & management
├── post.service.js        # Social feed & posts
├── orders.service.js      # Order management & real-time updates
├── inventory.service.js   # Inventory & product management
├── roles.service.js       # Role-based access control
├── settings.service.js    # User & business settings
└── api-test.service.js    # API testing utilities
```

## Backend API Endpoints

### Authentication (`/api/accounts/`)

| Method | Endpoint | Frontend Service | Description |
|--------|----------|------------------|-------------|
| POST | `/login/` | `authService.login()` | User login |
| POST | `/token/` | `authService.obtainToken()` | JWT token obtain |
| POST | `/token/refresh/` | `authService.refreshToken()` | Refresh JWT token |
| POST | `/register/` | `authService.register()` | User registration |
| GET | `/user-info/` | `authService.getUserInfo()` | Get user information |
| PATCH | `/user-profile/` | `authService.updateUserProfile()` | Update user profile |
| GET | `/profiles/` | `authService.getBusinessProfiles()` | Get business profiles |
| POST | `/profiles/switch/` | `authService.switchBusinessProfile()` | Switch business profile |
| GET | `/profiles/current/` | `authService.getCurrentBusinessProfile()` | Get current profile |
| POST | `/profiles/create-post/` | `authService.createBusinessPost()` | Create business post |

### Business Management (`/api/business/`)

| Method | Endpoint | Frontend Service | Description |
|--------|----------|------------------|-------------|
| GET | `/` | `businessService.searchBusinesses()` | Search businesses |
| POST | `/` | `authService.createBusiness()` | Create business |
| GET | `/{id}/` | `businessService.getBusinessById()` | Get business details |
| PATCH | `/{id}/` | `businessService.updateBusiness()` | Update business |
| GET | `/user-businesses/` | `businessService.getUserBusinesses()` | Get user businesses |
| POST | `/switch-business/` | `businessService.switchBusiness()` | Switch active business |
| POST | `/join-business/` | `businessService.joinBusiness()` | Join business directly |
| POST | `/leave-business/` | `businessService.leaveBusiness()` | Leave business |
| POST | `/join-business-request/` | `businessService.joinBusinessRequest()` | Request to join |
| GET | `/business-requests/` | `businessService.getBusinessRequests()` | Get join requests |
| PATCH | `/business-requests/{id}/` | `businessService.approveBusinessRequest()` | Approve/reject request |
| POST | `/invitations/create/` | `businessService.createInvitation()` | Create invitation |
| POST | `/invitations/use/` | `businessService.useInvitation()` | Use invitation |
| GET | `/invitations/list/` | `businessService.getInvitations()` | List invitations |

### Posts & Social Feed (`/api/posts/`)

| Method | Endpoint | Frontend Service | Description |
|--------|----------|------------------|-------------|
| GET | `/` | `postService.getFeed()` | Get posts feed |
| POST | `/` | `postService.createPost()` | Create new post |
| DELETE | `/{id}/` | `postService.deletePost()` | Delete post |
| POST | `/{id}/like/` | `postService.likePost()` | Like/unlike post |
| POST | `/{id}/comment/` | `postService.commentPost()` | Add comment |
| GET | `/{id}/comments/` | `postService.getComments()` | Get post comments |

### Orders Management (`/api/`)

| Method | Endpoint | Frontend Service | Description |
|--------|----------|------------------|-------------|
| GET | `/orders/` | `ordersService.getOrders()` | Get all orders |
| POST | `/orders/` | `ordersService.createOrder()` | Create new order |
| GET | `/orders/{id}/` | `ordersService.getOrder()` | Get order details |
| PATCH | `/orders/{id}/` | `ordersService.updateOrder()` | Update order |
| DELETE | `/orders/{id}/` | `ordersService.deleteOrder()` | Delete order |
| GET | `/orders/statistics/` | `ordersService.getOrderStatistics()` | Get order statistics |

### Inventory Management (`/api/inventory/`)

| Method | Endpoint | Frontend Service | Description |
|--------|----------|------------------|-------------|
| GET | `/products/` | `inventoryService.getProducts()` | Get all products |
| POST | `/products/` | `inventoryService.createProduct()` | Create product |
| GET | `/products/{id}/` | `inventoryService.getProduct()` | Get product details |
| PATCH | `/products/{id}/` | `inventoryService.updateProduct()` | Update product |
| DELETE | `/products/{id}/` | `inventoryService.deleteProduct()` | Delete product |
| GET | `/categories/` | `inventoryService.getCategories()` | Get categories |
| POST | `/categories/` | `inventoryService.createCategory()` | Create category |
| PATCH | `/categories/{id}/` | `inventoryService.updateCategory()` | Update category |
| DELETE | `/categories/{id}/` | `inventoryService.deleteCategory()` | Delete category |
| GET | `/stock-movements/` | `inventoryService.getStockMovements()` | Get stock movements |
| POST | `/stock-movements/` | `inventoryService.createStockMovement()` | Create stock movement |

### Roles & Permissions (`/api/roles/`)

| Method | Endpoint | Frontend Service | Description |
|--------|----------|------------------|-------------|
| GET | `/roles/` | `rolesService.getRoles()` | Get all roles |
| POST | `/roles/` | `rolesService.createRole()` | Create new role |
| GET | `/roles/{id}/` | `rolesService.getRole()` | Get role details |
| PATCH | `/roles/{id}/` | `rolesService.updateRole()` | Update role |
| DELETE | `/roles/{id}/` | `rolesService.deleteRole()` | Delete role |
| POST | `/assign-role/` | `rolesService.assignRole()` | Assign role to user |
| DELETE | `/assign-role/` | `rolesService.removeRole()` | Remove role from user |
| GET | `/permissions/` | `rolesService.getUserPermissions()` | Get user permissions |
| PATCH | `/roles/{id}/permissions/` | `rolesService.updateRolePermissions()` | Update role permissions |
| GET | `/templates/` | `rolesService.getRoleTemplates()` | Get role templates |
| POST | `/create-from-template/` | `rolesService.createRoleFromTemplate()` | Create role from template |
| GET | `/management/` | `rolesService.getBusinessRoleManagement()` | Get role management |
| PATCH | `/management/{id}/` | `rolesService.updateRoleManagement()` | Update role management |

### Settings (`/api/settings/`)

| Method | Endpoint | Frontend Service | Description |
|--------|----------|------------------|-------------|
| GET | `/user/` | `settingsService.getUserSettings()` | Get user settings |
| PUT | `/user/` | `settingsService.updateUserSettings()` | Update user settings |
| PATCH | `/user/` | `settingsService.patchUserSettings()` | Patch user settings |
| POST | `/user/reset_to_defaults/` | `settingsService.resetUserSettings()` | Reset user settings |
| GET | `/business/` | `settingsService.getBusinessSettings()` | Get business settings |
| PUT | `/business/` | `settingsService.updateBusinessSettings()` | Update business settings |
| PATCH | `/business/` | `settingsService.patchBusinessSettings()` | Patch business settings |
| POST | `/business/reset_to_defaults/` | `settingsService.resetBusinessSettings()` | Reset business settings |
| GET | `/notifications/` | `settingsService.getNotificationTemplates()` | Get notification templates |
| POST | `/notifications/` | `settingsService.createNotificationTemplate()` | Create template |
| PATCH | `/notifications/{id}/` | `settingsService.updateNotificationTemplate()` | Update template |
| DELETE | `/notifications/{id}/` | `settingsService.deleteNotificationTemplate()` | Delete template |
| POST | `/notifications/create_default_templates/` | `settingsService.createDefaultTemplates()` | Create default templates |
| GET | `/summary/` | `settingsService.getSettingsSummary()` | Get settings summary |
| POST | `/summary/export_settings/` | `settingsService.exportAndDownloadSettings()` | Export settings |

## Environment Configuration

### Development (.env.development)
```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=Restaurante Manager
VITE_WS_URL=ws://localhost:8000
VITE_ENABLE_DEBUG=true
VITE_ENABLE_WEBSOCKETS=true
```

### Production (.env.production)
```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_WS_URL=wss://your-backend-domain.com
VITE_ENABLE_DEBUG=false
VITE_LOG_LEVEL=error
```

## Key Features Implemented

### 1. Automatic Token Management
- JWT token automatic refresh
- Request/response interceptors
- Automatic logout on token expiration

### 2. Multi-Business Support
- Business switching functionality
- User business profiles
- Business-specific permissions

### 3. Real-time Updates
- WebSocket integration for orders
- Live order status updates
- Real-time notifications

### 4. Comprehensive Error Handling
- User-friendly error messages
- Network error handling
- Automatic retry mechanisms

### 5. Role-Based Access Control
- Permission checking utilities
- Role templates and management
- Dynamic permission evaluation

### 6. Settings Management
- User and business settings
- Settings export/import
- Default value restoration

## Testing

### API Test Page
Access `/api-test` to run comprehensive tests of all API integrations.

### Test Coverage
- ✅ Authentication flows
- ✅ Business operations
- ✅ Post management
- ✅ Order operations
- ✅ Inventory management
- ✅ Role and permissions
- ✅ Settings management

## Usage Examples

### Basic Authentication
```javascript
import authService from './services/auth.service';

// Login
const result = await authService.login({
  username: 'user@example.com',
  password: 'password'
});

// Get user info
const user = await authService.getUserInfo();
```

### Business Operations
```javascript
import businessService from './services/business.service';

// Get user businesses
const businesses = await businessService.getUserBusinesses();

// Switch business
await businessService.switchBusiness(businessId);
```

### Order Management
```javascript
import ordersService from './services/orders.service';

// Get orders
const orders = await ordersService.getOrders();

// Update order status
await ordersService.updateOrderStatus(orderId, 'confirmed');

// Real-time updates
const ws = ordersService.subscribeToOrderUpdates((update) => {
  console.log('Order updated:', update);
});
```

## Error Handling

All services implement comprehensive error handling:

- **Network errors**: Connection issues, timeout
- **Authentication errors**: Token expiry, invalid credentials
- **Authorization errors**: Insufficient permissions
- **Validation errors**: Invalid data format
- **Server errors**: Backend internal errors

## Best Practices

1. **Always check authentication** before making API calls
2. **Handle loading states** appropriately in components
3. **Use error boundaries** for graceful error handling
4. **Implement optimistic updates** for better UX
5. **Cache frequently used data** when appropriate
6. **Use WebSockets** for real-time features
7. **Validate data** before sending to API
8. **Log errors** appropriately for debugging

## Troubleshooting

### Common Issues

1. **CORS errors**: Ensure backend CORS settings allow frontend domain
2. **Token expiry**: Check if refresh token mechanism is working
3. **Network errors**: Verify backend is running and accessible
4. **Permission errors**: Check user roles and business context
5. **WebSocket issues**: Verify WebSocket URLs and authentication

### Debug Tools

- Browser DevTools Network tab
- Console logs with detailed API information
- `/api-test` page for comprehensive testing
- `/debug` page for authentication testing

## Future Enhancements

- [ ] Offline support with data caching
- [ ] Push notifications integration
- [ ] File upload progress tracking
- [ ] Advanced error retry strategies
- [ ] API response caching
- [ ] Request queuing for offline scenarios