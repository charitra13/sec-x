'use client'

import { useState, useRef, useEffect } from 'react'
import { IUser } from '@/types'

interface UserMenuProps {
  user: IUser;
  onLogout: () => Promise<void>;
  isMobile?: boolean;
}

export default function UserMenu({ user, onLogout, isMobile = false }: UserMenuProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleToggleDropdown = () => {
        setDropdownOpen(prev => !prev);
    };

    const handleLogout = async () => {
        try {
            await onLogout();
            setDropdownOpen(false);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const userName = user.name.split(' ')[0]; // Display first name

    if (isMobile) {
        return (
            <div className="w-full text-left">
                <div className="flex items-center space-x-3 px-4 py-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-semibold text-white">{user.name}</p>
                        <p className="text-sm text-white/60">{user.email}</p>
                    </div>
                </div>
                <div className="border-t border-white/10 my-2"></div>
                <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 flex items-center space-x-3"
                >
                    <span>Log Out</span>
                </button>
            </div>
        );
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={handleToggleDropdown}
                className="glass-button flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-medium hover:bg-white/10 transition-all duration-300"
            >
                 <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold text-sm">
                        {user.name.charAt(0)}
                    </div>
                <span className="truncate max-w-[100px]">{userName}</span>
            </button>

            {dropdownOpen && (
                <div
                    className="absolute right-0 mt-2 w-56 bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg shadow-lg z-50 overflow-hidden animate-dropdown-enter-active"
                >
                    <div className="p-2">
                        <div className="px-2 py-2">
                            <p className="font-semibold text-white truncate">{user.name}</p>
                            <p className="text-sm text-white/60 truncate">{user.email}</p>
                        </div>
                        <div className="border-t border-white/10 my-1"></div>
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-md flex items-center space-x-2 transition-colors duration-200"
                        >
                            <span>Log Out</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
