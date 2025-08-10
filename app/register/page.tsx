"use client";

import { useEffect, useState } from 'react';
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
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-z0-9._]+$/, 'Username can only contain letters, numbers, dots, and underscores')
    .transform((val) => val.toLowerCase()),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema)
  });

  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);

  const usernameValue = watch('username');

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    const debounce = setTimeout(async () => {
      const value = (usernameValue || '').toLowerCase();
      if (!value || value.length < 3) {
        if (active) setIsUsernameAvailable(null);
        return;
      }
      // quick client regex validation to avoid unnecessary requests
      const formatOk = /^[a-z0-9._]+$/.test(value);
      if (!formatOk) {
        if (active) setIsUsernameAvailable(null);
        return;
      }
      try {
        const response = await api.get(`/auth/check-username/${value}`, { signal: controller.signal as any });
        if (active) setIsUsernameAvailable(!!response.data?.available);
      } catch (_e) {
        if (active) setIsUsernameAvailable(null);
      }
    }, 300);

    return () => {
      active = false;
      controller.abort();
      clearTimeout(debounce);
    };
  }, [usernameValue]);

  const onSubmit = async (data: RegisterValues) => {
    try {
      await registerUser(data.name, data.username, data.email, data.password);
    } catch (error: any) {
      // Only handle specific errors that aren't already handled in AuthContext
      if (error.name === 'CORSError') {
        // CORS errors are already handled in AuthContext
        return;
      }
      
      // Handle network errors specifically
      if (!error.response && error.message === 'Network Error') {
        // Network errors are already handled in API interceptor
        return;
      }
      
      // For other errors, let AuthContext handle them
      // but prevent additional error propagation
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
              <p className="text-xs text-gray-500">Only lowercase letters, numbers, dots, and underscores allowed</p>
              {isUsernameAvailable === false && (
                <p className="text-red-500 text-xs">Username already taken</p>
              )}
              {isUsernameAvailable === true && (
                <p className="text-green-500 text-xs">Username available</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" {...register('email')} />
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