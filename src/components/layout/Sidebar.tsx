
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Package, 
  LayoutDashboard, 
  History, 
  PlusCircle, 
  Settings,
  Boxes
} from 'lucide-react';

const navItems = [
  { 
    name: 'Dashboard', 
    path: '/', 
    icon: <LayoutDashboard className="w-5 h-5" /> 
  },
  { 
    name: 'Inventory', 
    path: '/inventory', 
    icon: <Boxes className="w-5 h-5" /> 
  },
  { 
    name: 'Add Stock', 
    path: '/add-stock', 
    icon: <PlusCircle className="w-5 h-5" /> 
  },
  { 
    name: 'Transaction History', 
    path: '/history', 
    icon: <History className="w-5 h-5" /> 
  },
  { 
    name: 'Settings', 
    path: '/settings', 
    icon: <Settings className="w-5 h-5" /> 
  }
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex flex-col h-full">
        {/* Logo and branding */}
        <div className="flex items-center h-16 px-6 border-b border-sidebar-border">
          <div className="flex items-center space-x-2">
            <Package className="w-6 h-6 text-primary" />
            <span className="text-lg font-semibold text-sidebar-foreground">InvenChain Vault</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-2.5 text-sm rounded-md font-medium transition-colors",
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer area */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center px-3 py-2 text-sm text-sidebar-foreground">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-sidebar-accent text-sidebar-accent-foreground">
              BC
            </div>
            <div className="ml-3">
              <p className="font-medium">Blockchain Secured</p>
              <p className="text-xs text-muted-foreground">All transactions recorded</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
