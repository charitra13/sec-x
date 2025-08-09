import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminGlassCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const AdminGlassCard = ({ children, className, title }: AdminGlassCardProps) => (
  <Card className={cn(
    'bg-white/5 backdrop-blur-xl border border-white/10 text-white',
    className
  )}>
    {title && (
      <CardHeader className="border-b border-white/10">
        <CardTitle className="text-white">{title}</CardTitle>
      </CardHeader>
    )}
    <CardContent className="p-6">
      {children}
    </CardContent>
  </Card>
);

interface AdminTableProps {
  children: React.ReactNode;
  className?: string;
}

export const AdminTable = ({ children, className }: AdminTableProps) => (
  <div className={cn(
    'bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden',
    className
  )}>
    <table className="w-full">
      {children}
    </table>
  </div>
);

interface AdminTableHeaderProps {
  children: React.ReactNode;
}

export const AdminTableHeader = ({ children }: AdminTableHeaderProps) => (
  <thead className="bg-white/5 border-b border-white/10">
    {children}
  </thead>
);

interface AdminTableBodyProps {
  children: React.ReactNode;
}

export const AdminTableBody = ({ children }: AdminTableBodyProps) => (
  <tbody className="divide-y divide-white/10">
    {children}
  </tbody>
);

