# Frontend Implementation Guide: Username & Name Support + Flexible Login

## Overview
This guide details the exact changes needed in the Next.js frontend to support both 'username' and 'name' fields in registration and allow login using either 'username' or 'email'.

## Files to Modify

### 1. User Types (`types/index.ts`)

**Update IUser interface to include username:**

```typescript
export interface IUser {
  _id: string;
  name: string;
  username: string; // ADD THIS LINE
  email: string;
  role: 'admin' | 'reader';
  avatar?: string;
  bio?: string;
  newsletter: boolean;
  isEmailVerified: boolean;
  lastLogin?: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Rest of interfaces remain the same...
```

### 2. Registration Page (`app/register/page.tsx`)

**Update registration form to include username field:**

```typescript
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import Link from 'next/link';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name cannot exceed 50 characters'),
  username: z // ADD THIS ENTIRE BLOCK
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers, and underscores')
    .transform(val => val.toLowerCase()), // Ensure lowercase
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterValues) => {
    try {
      await registerUser(data.name, data.username, data.email, data.password); // ADD username parameter
    } catch (error: any) {
      // Error handling remains the same...
      if (error.name === 'CORSError') {
        return;
      }
      
      if (!error.response && error.message === 'Network Error') {
        return;
      }
      
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="container mx-auto flex h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>Create a new account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" type="text" placeholder="John Doe" {...register('name')} />
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>
            
            {/* ADD THIS ENTIRE BLOCK */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                type="text" 
                placeholder="johndoe" 
                {...register('username')}
                className="lowercase"
              />
              {errors.username && <p className="text-red-500 text-xs">{errors.username.message}</p>}
              <p className="text-xs text-gray-500">
                Only lowercase letters, numbers, and underscores allowed
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" {...register('email')} />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInput id="password" {...register('password')} />
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Register'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="mt-4 text-xs text-center text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
```

### 3. Login Page (`app/login/page.tsx`)

**Update login form to accept email or username:**

```typescript
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import Link from 'next/link';

const loginSchema = z.object({
  emailOrUsername: z // CHANGE FROM email to emailOrUsername
    .string()
    .min(1, 'Email or username is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginValues) => {
    try {
      await login(data.emailOrUsername, data.password); // UPDATE parameter name
    } catch (error: any) {
      // Error handling remains the same...
      if (error.name === 'CORSError') {
        return;
      }
      
      if (!error.response && error.message === 'Network Error') {
        return;
      }
      
      console.error('Login error:', error);
    }
  };

  return (
    <div className="container mx-auto flex h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email or username below to login to your account.</CardDescription> {/* UPDATE description */}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emailOrUsername">Email or Username</Label> {/* UPDATE label */}
              <Input 
                id="emailOrUsername" 
                type="text" 
                placeholder="john@example.com or johndoe" 
                {...register('emailOrUsername')} 
              /> {/* UPDATE field */}
              {errors.emailOrUsername && <p className="text-red-500 text-xs">{errors.emailOrUsername.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInput id="password" {...register('password')} />
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="mt-4 text-xs text-center text-gray-400">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-500 hover:underline">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
```

### 4. Auth Context (`context/AuthContext.tsx`)

**Update AuthContext to handle new API structure:**

```typescript
// Update the interface
interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  loadingMessage: string | null;
  error: Error | null;
  sessionPersistent: boolean | null;
  login: (emailOrUsername: string, password: string) => Promise<void>; // UPDATE parameter
  register: (name: string, username: string, email: string, password: string) => Promise<void>; // ADD username
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
  clearError: () => void;
  resetAuthState: () => void;
  validateSessionPersistence: () => Promise<boolean>;
}

// Update the login function
const login = async (emailOrUsername: string, password: string) => { // UPDATE parameter
  try {
    resetAuthState();
    setLoadingState(true, 'Authenticating...');
    
    console.log('🔐 Starting login attempt...');

    const { data } = await api.post('/auth/login', { emailOrUsername, password }); // UPDATE API call
    
    // Debug logging and response handling remains mostly the same...
    debugLoginResponse(data);
    
    let user, token;
    
    if (data.data?.user && data.data?.token) {
      user = data.data.user;
      token = data.data.token;
      console.log('✅ Using nested data.data structure');
    } else if (data.user && data.token) {
      user = data.user;
      token = data.token;
      console.log('✅ Using direct structure');
    } else if (data.payload?.user && data.payload?.token) {
      user = data.payload.user;
      token = data.payload.token;
      console.log('✅ Using payload structure');
    } else {
      console.error('❌ No valid response structure found:', data);
      console.error('Available keys:', Object.keys(data || {}));
      throw new Error('Invalid response structure from server - no user or token found');
    }
    
    if (!user) {
      console.error('❌ No user data in response:', data);
      throw new Error('No user data received from server');
    }
    
    if (!token) {
      console.error('❌ No token in response:', data);
      throw new Error('No authentication token received');
    }
    
    // Store token and set user...
    Cookies.set('token', token, { 
      expires: 7,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    setLoadingState(true, 'Setting up user session...');
    setUser(user);
    
    if (!isShowingToast) {
      setIsShowingToast(true);
      toast.success('Login successful!');
    }
    
    const userRole = user.role;
    if (!userRole) {
      console.error('❌ No user role found:', user);
      throw new Error('User role not found in response');
    }
    
    setLoadingState(true, 'Redirecting to dashboard...');
    console.log('✅ Redirecting user with role:', userRole);
    
    if (userRole === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/dashboard');
    }
  } catch (err: any) {
    // Error handling remains the same...
    if (!isShowingToast) {
      setIsShowingToast(true);
      
      if (isCORSError(err)) {
        setError(new Error('Unable to connect to authentication server'));
        toast.error('Connection blocked by security policy');
      } else if (err.response?.status === 401) {
        setError(new Error('Invalid email/username or password'));
        toast.error('Invalid credentials');
      } else {
        setError(err);
        toast.error(err.response?.data?.message || 'Login failed');
      }
    }
    throw err;
  } finally {
    setLoadingState(false);
    setTimeout(() => setIsShowingToast(false), 1000);
  }
};

// Update the register function
const register = async (name: string, username: string, email: string, password: string) => { // ADD username parameter
  try {
    resetAuthState();
    setLoadingState(true, 'Creating your account...');
    
    console.log('📝 Starting registration attempt...');

    const { data } = await api.post('/auth/register', { name, username, email, password }); // ADD username to API call
    
    // Debug logging and response handling remains mostly the same...
    debugLoginResponse(data);
    
    let user, token;
    
    if (data.data?.user && data.data?.token) {
      user = data.data.user;
      token = data.data.token;
      console.log('✅ Registration using nested data.data structure');
    } else if (data.user && data.token) {
      user = data.user;
      token = data.token;
      console.log('✅ Registration using direct structure');
    } else if (data.payload?.user && data.payload?.token) {
      user = data.payload.user;
      token = data.payload.token;
      console.log('✅ Registration using payload structure');
    } else {
      console.error('❌ No valid registration response structure found:', data);
      console.error('Available keys:', Object.keys(data || {}));
      throw new Error('Invalid response structure from server - no user or token found');
    }
    
    if (!user) {
      console.error('❌ No user data in registration response:', data);
      throw new Error('No user data received from server');
    }
    
    if (!token) {
      console.error('❌ No token in registration response:', data);
      throw new Error('No authentication token received');
    }
    
    // Store token and set user...
    Cookies.set('token', token, { 
      expires: 7,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    setLoadingState(true, 'Setting up your account...');
    setUser(user);
    
    if (!isShowingToast) {
      setIsShowingToast(true);
      toast.success('Registration successful!');
    }
    
    const userRole = user.role;
    if (!userRole) {
      console.error('❌ No user role found in registration:', user);
      throw new Error('User role not found in response');
    }
    
    setLoadingState(true, 'Redirecting to your dashboard...');
    console.log('✅ Redirecting registered user with role:', userRole);
    
    if (userRole === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/dashboard');
    }
  } catch (err: any) {
    // Error handling remains the same...
    if (!isShowingToast) {
      setIsShowingToast(true);
      
      if (isCORSError(err)) {
        setError(new Error('Unable to connect to registration server'));
        toast.error('Connection blocked by security policy');
      } else {
        setError(err);
        toast.error(err.response?.data?.message || 'Registration failed');
      }
    }
    throw err;
  } finally {
    setLoadingState(false);
    setTimeout(() => setIsShowingToast(false), 1000);
  }
};

// Rest of the AuthContext remains the same...
```

### 5. Create Username Input Component (Optional Enhancement)

**Create new component for username input with real-time validation (`components/ui/username-input.tsx`):**

```typescript
"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface UsernameInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onUsernameValidation?: (isValid: boolean, username: string) => void;
}

const UsernameInput = React.forwardRef<HTMLInputElement, UsernameInputProps>(
  ({ className, onUsernameValidation, ...props }, ref) => {
    const [username, setUsername] = React.useState("");
    const [isChecking, setIsChecking] = React.useState(false);
    const [isAvailable, setIsAvailable] = React.useState<boolean | null>(null);

    const checkUsernameAvailability = React.useCallback(
      async (username: string) => {
        if (!username || username.length < 3) {
          setIsAvailable(null);
          return;
        }

        setIsChecking(true);
        try {
          // You can add an API call here to check username availability
          // const response = await api.get(`/auth/check-username/${username}`);
          // setIsAvailable(response.data.available);
          
          // For now, just validate format
          const isValid = /^[a-z0-9_]+$/.test(username);
          setIsAvailable(isValid);
          onUsernameValidation?.(isValid, username);
        } catch (error) {
          setIsAvailable(false);
        } finally {
          setIsChecking(false);
        }
      },
      [onUsernameValidation]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.toLowerCase();
      setUsername(value);
      props.onChange?.(e);
      
      // Debounce the availability check
      const timer = setTimeout(() => {
        checkUsernameAvailability(value);
      }, 300);

      return () => clearTimeout(timer);
    };

    return (
      <div className="relative">
        <Input
          {...props}
          ref={ref}
          value={username}
          onChange={handleChange}
          className={cn(
            "pr-10",
            isAvailable === true && "border-green-500",
            isAvailable === false && "border-red-500",
            className
          )}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isChecking && (
            <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full" />
          )}
          {!isChecking && isAvailable === true && (
            <Check className="h-4 w-4 text-green-500" />
          )}
          {!isChecking && isAvailable === false && (
            <X className="h-4 w-4 text-red-500" />
          )}
        </div>
      </div>
    );
  }
);

UsernameInput.displayName = "UsernameInput";

export { UsernameInput };
```

### 6. Optional: Add Username Availability Check Route

**If you want to implement real-time username checking, add this to backend routes:**

```typescript
// In auth.routes.ts
router.get('/check-username/:username', checkUsernameAvailability);

// In auth.controller.ts
export const checkUsernameAvailability = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.params;
    
    if (!username || username.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Username must be at least 3 characters'
      });
    }

    const existingUser = await User.findOne({ username: username.toLowerCase() });
    
    res.json({
      success: true,
      available: !existingUser,
      username: username.toLowerCase()
    });
  } catch (error) {
    next(error);
  }
};
```

## Testing Checklist

### Registration Testing:
- [ ] Can register with name, username, email, and password
- [ ] Username validation works (lowercase, alphanumeric + underscore)
- [ ] Error handling for duplicate username
- [ ] Error handling for duplicate email
- [ ] Form validation displays appropriate errors
- [ ] Successful registration redirects correctly

### Login Testing:
- [ ] Can login with email address
- [ ] Can login with username
- [ ] Error handling for invalid credentials
- [ ] Form validation works
- [ ] Successful login redirects correctly
- [ ] JWT token includes username

### UI/UX Testing:
- [ ] Username field displays properly in registration form
- [ ] Login form clearly indicates email OR username accepted
- [ ] Loading states work correctly
- [ ] Error messages are user-friendly
- [ ] Form validation is real-time and helpful

## Implementation Steps

1. **Update Types**: Add username to IUser interface
2. **Update Registration**: Add username field and validation
3. **Update Login**: Change to emailOrUsername field
4. **Update AuthContext**: Modify API calls and function signatures
5. **Test Registration**: Verify new user creation with username
6. **Test Login**: Verify login works with both email and username
7. **Error Testing**: Verify all error scenarios work correctly
8. **UI Polish**: Ensure forms look good and provide clear guidance

## Notes

- Username input automatically converts to lowercase
- Username validation happens client-side and server-side
- Clear user guidance about username format requirements
- Login field accepts both email and username for flexibility
- Error messages are specific to help users understand issues
- Optional username availability checking can be added for better UX