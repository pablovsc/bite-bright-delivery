
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

const AdminHeader = () => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200 lg:pl-64">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile logo - only show on smaller screens */}
          <div className="lg:hidden">
            <h1 className="text-xl font-bold text-orange-600">Flamas</h1>
          </div>
          
          {/* User info and actions */}
          <div className="flex items-center space-x-4 ml-auto">
            <span className="text-sm text-gray-600 hidden sm:block">Ana Admin</span>
            <Link to="/">
              <Button variant="outline" size="sm">
                <Home className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Salir</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
