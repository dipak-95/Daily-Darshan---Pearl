import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Dashboard as DashboardIcon,
    Logout,
    Menu as MenuIcon,
    Close,
    TempleHindu,
    CloudUpload
} from '@mui/icons-material';

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
        // Add more items if needed
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-30 w-72 bg-white border-r border-gray-100 shadow-xl lg:shadow-none transform transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                <div className="h-full flex flex-col">
                    {/* Logo Area */}
                    <div className="h-20 flex items-center gap-3 px-8 border-b border-gray-50">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <TempleHindu className="text-white" fontSize="small" />
                        </div>
                        <div>
                            <h1 className="font-bold text-gray-800 text-lg leading-tight">Daily Darshan</h1>
                            <span className="text-xs text-orange-500 font-medium tracking-wider uppercase">Admin Panel</span>
                        </div>
                    </div>

                    {/* Nav Items */}
                    <nav className="flex-1 px-4 py-8 space-y-2">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`
                                        flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group
                                        ${isActive
                                            ? 'bg-orange-50 text-orange-600 font-semibold shadow-sm'
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                                    `}
                                >
                                    <span className={`${isActive ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-600'} transition-colors`}>
                                        {item.icon}
                                    </span>
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile / Logout */}
                    <div className="p-4 border-t border-gray-50">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                        >
                            <Logout fontSize="small" />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Top Header (Mobile Only mostly) */}
                <header className="h-16 lg:hidden bg-white border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                            <TempleHindu className="text-orange-600" fontSize="small" />
                        </div>
                        <span className="font-bold text-gray-800">Daily Darshan</span>
                    </div>
                    <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                        <MenuIcon />
                    </button>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-gray-50 scroll-smooth">
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Layout;
