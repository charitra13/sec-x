# 🔐 Authentication Navigation Integration - Implementation Prompt

## Project Context
You are working on **SecurityX**, a Next.js 14 blog application with TypeScript. The app has a comprehensive authentication system with JWT tokens and cookie-based session management. Your task is to integrate authentication state management into the navigation bar.

## Current Codebase Structure

### AuthContext Interface
The application has a robust AuthContext with the following interface:
```typescript
interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  loadingMessage: string | null;
  error: Error | null;
  sessionPersistent: boolean | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
  clearError: () => void;
  resetAuthState: () => void;
  validateSessionPersistence: () => Promise<boolean>;
}
```

### User Interface
```typescript
interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'reader';
  createdAt: string;
  updatedAt: string;
}
```

### Current Navigation Component Structure
The existing Navigation component (`app/components/Navigation.tsx`) has:
- Fixed navigation bar with backdrop blur
- SecurityX logo and brand name
- Mobile hamburger menu
- Desktop navigation links (Home, About, Team, Blog, Publications)
- Current action buttons: "Contact" and "Log In"
- Responsive design with mobile/desktop variations

## 🎯 Implementation Requirements

### 1. Create UserMenu Component
Create a new component `UserMenu.tsx` in `app/components/` that:

**Props Interface:**
```typescript
interface UserMenuProps {
  user: IUser;
  onLogout: () => Promise<void>;
  isMobile?: boolean;
}
```

**Functionality:**
- Displays user's name as a clickable button
- Shows dropdown menu on click
- Contains logout button
- Handles click outside to close
- Mobile-responsive design

### 2. Integrate with Navigation Component

**Authentication State Handling:**
- Import and use `useAuth()` hook
- Conditionally render UserMenu when `isAuthenticated` is true
- Show "Log In" button when `isAuthenticated` is false
- Handle loading states appropriately

**UI Integration:**
- Replace the current "Log In" button area with conditional rendering
- Maintain existing spacing and layout
- Ensure mobile menu integration works seamlessly

## 🎨 Design Specifications

### Visual Requirements
1. **User Button Styling:**
   - Match existing navigation button styles
   - Use `glass-button` class for consistency
   - Show user's first name or full name (max 20 characters)
   - Add subtle user icon or avatar placeholder

2. **Dropdown Menu Styling:**
   - Dark background with backdrop blur (`bg-black/90 backdrop-blur-xl`)
   - White border with opacity (`border-white/10`)
   - Rounded corners (`rounded-lg`)
   - Drop shadow for depth
   - Smooth animations (fade in/out)

3. **Logout Button:**
   - Red accent color for logout action
   - Hover states with smooth transitions
   - Clear "Log Out" text with optional icon

### Responsive Behavior
- **Desktop:** Dropdown appears below user button
- **Mobile:** Integrate into existing mobile menu
- **Positioning:** Use absolute positioning with proper z-index

## 🔧 Technical Implementation

### Key Requirements
1. **State Management:**
   ```typescript
   const { user, isAuthenticated, logout, loading } = useAuth();
   ```

2. **Click Outside Handler:**
   ```typescript
   useEffect(() => {
     const handleClickOutside = (event: MouseEvent) => {
       // Close dropdown when clicking outside
     };
     document.addEventListener('mousedown', handleClickOutside);
     return () => document.removeEventListener('mousedown', handleClickOutside);
   }, []);
   ```

3. **Logout Implementation:**
   ```typescript
   const handleLogout = async () => {
     try {
       await logout();
       setDropdownOpen(false);
       // AuthContext handles redirect to home page
     } catch (error) {
       console.error('Logout error:', error);
     }
   };
   ```

### Animation Classes (using existing Tailwind)
```css
/* Dropdown fade in/out */
.dropdown-enter {
  @apply opacity-0 scale-95 translate-y-1;
}
.dropdown-enter-active {
  @apply opacity-100 scale-100 translate-y-0 transition-all duration-200 ease-out;
}
.dropdown-exit {
  @apply opacity-100 scale-100 translate-y-0;
}
.dropdown-exit-active {
  @apply opacity-0 scale-95 translate-y-1 transition-all duration-150 ease-in;
}
```

## 📱 Implementation Steps

### Step 1: Create UserMenu Component
```typescript
// app/components/UserMenu.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { IUser } from '@/types'

interface UserMenuProps {
  user: IUser;
  onLogout: () => Promise<void>;
  isMobile?: boolean;
}

export default function UserMenu({ user, onLogout, isMobile = false }: UserMenuProps) {
  // Implementation here
}
```

### Step 2: Update Navigation Component
```typescript
// Add to app/components/Navigation.tsx imports
import { useAuth } from '@/context/AuthContext'
import UserMenu from './UserMenu'

// In the component, replace the login button area:
const { user, isAuthenticated, logout, loading } = useAuth();

// Replace current login button section with:
{!loading && (
  <div className="flex items-center space-x-4">
    <Link 
      href="/contact"
      className="glass-button px-4 py-2 rounded-lg text-white font-medium hover:bg-white/10 transition-all duration-300"
    >
      Contact
    </Link>
    {isAuthenticated && user ? (
      <UserMenu user={user} onLogout={logout} />
    ) : (
      <Link 
        href="/login"
        className="glass-button px-4 py-2 rounded-lg text-white font-medium hover:bg-white/10 transition-all duration-300"
      >
        Log In
      </Link>
    )}
  </div>
)}
```

### Step 3: Mobile Integration
Ensure the UserMenu works within the mobile menu structure and maintains the same conditional rendering logic.

## 🚀 Expected Behavior

### User Experience Flow
1. **Unauthenticated State:** Show "Log In" button
2. **Authentication Loading:** Show loading indicator or hide buttons
3. **Authenticated State:** Show user's name as clickable button
4. **Click User Name:** Open dropdown with logout option
5. **Click Logout:** Execute logout and redirect to home page
6. **Click Outside:** Close dropdown menu

### Error Handling
- Handle logout errors gracefully
- Maintain UI state during async operations
- Provide visual feedback for user actions

## 🎯 Success Criteria

✅ **Functional Requirements:**
- User name displays when authenticated
- Dropdown opens/closes correctly
- Logout functionality works
- Mobile responsive behavior
- Integrates seamlessly with existing navigation

✅ **Visual Requirements:**
- Matches existing design system
- Smooth animations and transitions
- Proper hover states and feedback
- Consistent spacing and alignment

✅ **Technical Requirements:**
- TypeScript compliance
- Proper error handling
- Accessible markup
- Performance optimized

## 📋 Additional Notes

- Use existing CSS classes and patterns from the current navigation
- Maintain the glass morphism aesthetic
- Ensure proper accessibility with ARIA labels
- Test with both admin and reader user roles
- Handle edge cases (long names, network errors)

**Authentication Context Usage:**
The AuthContext is already wrapped around the application and handles all authentication logic including redirects after logout. Your component only needs to call the logout function - the context handles the rest.

**Styling Note:**
The application uses a dark theme with glass morphism effects. Maintain consistency with the existing `glass-button` styling and the overall visual hierarchy.