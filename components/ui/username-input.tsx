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
      async (value: string) => {
        if (!value || value.length < 3) {
          setIsAvailable(null);
          return;
        }

        setIsChecking(true);
        try {
          // TODO: Integrate API call for real availability check
          // const response = await api.get(`/auth/check-username/${value}`);
          // setIsAvailable(response.data.available);

          const isValid = /^[a-z0-9_]+$/.test(value);
          setIsAvailable(isValid);
          onUsernameValidation?.(isValid, value);
        } catch (_error) {
          setIsAvailable(false);
        } finally {
          setIsChecking(false);
        }
      },
      [onUsernameValidation]
    );

    const debounceTimer = React.useRef<number | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.toLowerCase();
      setUsername(value);
      props.onChange?.(e);

      if (debounceTimer.current) {
        window.clearTimeout(debounceTimer.current);
      }
      debounceTimer.current = window.setTimeout(() => {
        checkUsernameAvailability(value);
      }, 300);
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
          {!isChecking && isAvailable === true && <Check className="h-4 w-4 text-green-500" />}
          {!isChecking && isAvailable === false && <X className="h-4 w-4 text-red-500" />}
        </div>
      </div>
    );
  }
);

UsernameInput.displayName = "UsernameInput";

export { UsernameInput };

