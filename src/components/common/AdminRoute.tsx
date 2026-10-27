import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { Button } from './Button';

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, toggleAdminRole } = useAuthStore();

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white mb-2">
          Admin Access Required
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
          You are currently logged in as a standard user ({user?.email || 'Guest'}). The Admin Panel is restricted to administrators for managing recipes, blogs, and settings.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <Button
            variant="primary"
            icon={<ShieldCheck className="w-4 h-4" />}
            onClick={() => {
              toggleAdminRole();
            }}
          >
            Grant Admin Role (Demo Mode)
          </Button>
          <Link to="/">
            <Button variant="ghost">Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
