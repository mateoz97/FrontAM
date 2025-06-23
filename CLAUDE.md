# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev` (runs on port 8080)
- **Build for production**: `npm run build`
- **Lint code**: `npm run lint`
- **Preview production build**: `npm run preview`

## Architecture Overview

This is a React restaurant management frontend application built with Vite, Material-UI, and React Router. The application uses a multi-business model where users can manage different restaurant businesses.

### Key Architectural Patterns

**Authentication & Authorization**:
- Uses JWT tokens with automatic refresh via Axios interceptors in `src/services/api.js`
- Context-based auth state management in `src/contexts/AuthContext.jsx`
- Role-based permissions system with `hasPermission()` method
- Protected routes with automatic redirect to login when unauthenticated

**Multi-Business Support**:
- Users can be associated with multiple businesses
- `activeBusinessId` state tracks current business context
- `switchBusiness()` function allows switching between businesses
- Business info embedded in user object as `business_info`

**Routing Structure**:
- Public routes: `/login`, `/register`
- Protected routes wrapped in `<MainLayout>` component
- Main route `/` serves the social feed (not dashboard)
- Business management routes: `/dashboard`, `/orders`, `/inventory`, `/users`, `/settings`
- Profile routes: `/profile`, `/business/profile`

**API Integration**:
- Centralized API client in `src/services/api.js` with interceptors
- Service layer pattern: `auth.service.js`, `business.service.js`, `post.service.js`, etc.
- Environment-based API URL configuration via `VITE_API_URL`
- Automatic token refresh and 401 error handling

**State Management**:
- React Context for authentication state
- Local state in components with hooks
- Custom hooks like `useSettings.js` for specific functionality

### Important File Locations

- **Main app entry**: `src/App.jsx` - Contains routing and auth setup
- **API configuration**: `src/services/api.js` - Axios setup with interceptors
- **Authentication**: `src/contexts/AuthContext.jsx` - Auth state and business switching
- **Constants**: `src/config/constants.js` - API URLs and route definitions
- **Theme**: `src/styles/theme.js` - Material-UI theme configuration
- **Main layout**: `src/layouts/MainLayout.jsx` - Shared layout for protected routes

### Component Structure

Components are organized by feature:
- `Register/` - Multi-step registration flow (UserType, PersonalInfo, BusinessConfig)
- `SocialFeed/` - Feed-related components (PostCard, CreatePost, Navigation)
- Pages in `src/pages/` correspond to main application sections

### Development Notes

- Uses Vite as build tool with React plugin
- Material-UI for component library and theming
- Axios for HTTP requests with automatic token management
- React Router v6 for client-side routing
- Environment variables prefixed with `VITE_` for frontend access

## Recent Optimizations and Accessibility Improvements

### Enhanced Component Library
- **AccessibleButton**: Button component optimized for all age groups with proper touch targets (48px min)
- **SimpleFormField**: Form fields with clear labels, examples, and error handling
- **EnhancedLoading**: Advanced loading states with skeleton screens and progress indicators
- **SimpleCard**: Flexible card component with accessibility features
- **ErrorBoundary**: User-friendly error handling with recovery options
- **NotificationSystem**: Clear, non-intrusive notification system

### Improved Hooks
- **useNotifications**: Centralized notification management with user-friendly messages
- **useAccessibleForm**: Form validation with clear, simple error messages
- **useSettings**: Enhanced settings management (existing, now optimized)

### Accessibility Features (WCAG AA Compliant)
- Minimum 44px touch targets for mobile interaction
- High contrast colors (4.5:1 ratio minimum)
- Large, readable fonts (16px minimum base size)
- Comprehensive keyboard navigation support
- Screen reader compatible with proper ARIA labels
- Clear, simple language throughout the interface
- Visual feedback for all user actions

### UX Optimizations for Ages 5-100
- **Simplified Language**: Technical terms replaced with everyday language
- **Visual Hierarchy**: Clear headings, proper spacing, logical flow
- **Error Messages**: Friendly, helpful messages with suggested actions
- **Loading States**: Clear progress indicators with reassuring messages
- **Confirmation Dialogs**: Simple yes/no questions for important actions
- **Help Text**: Examples and explanations for all form fields

### Enhanced Theme
- Increased font sizes across all components
- Better color contrast ratios
- Larger interactive elements
- Consistent spacing and padding
- Smooth animations that can be disabled
- Focus indicators for keyboard navigation

### Configuration Improvements
- **Enhanced Constants**: Comprehensive configuration with accessibility settings
- **User-Friendly Messages**: Predefined messages in simple Spanish
- **Feature Flags**: Easy toggling of accessibility features
- **Color Schemes**: Consistent color coding for different states

### Error Handling Improvements
- **AuthContext**: Enhanced with user-friendly error messages and better state management
- **API Interceptors**: Improved error handling with automatic retry and clear feedback
- **Form Validation**: Real-time validation with helpful suggestions
- **Network Errors**: Specific handling for connection issues

### Implementation Notes

When adding new features, follow these accessibility guidelines:
1. Use the enhanced component library (`src/components/common/`)
2. Implement proper ARIA labels and roles
3. Ensure keyboard navigation works for all interactions
4. Test with screen readers
5. Use the notification system for user feedback
6. Follow the enhanced theme sizing and contrast guidelines
7. Write clear, simple text suitable for all reading levels

### Testing Accessibility
```bash
# Run with screen reader testing
# Test keyboard-only navigation
# Verify color contrast ratios
# Test with users aged 50+ when possible
```