import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Mail, Users, Settings, LogOut } from 'lucide-react';

export default function Layout() {
    const sidebarVariants = {
        hidden: { x: -100, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20
            }
        }
    };

    const linkVariants = {
        hover: {
            scale: 1.05,
            x: 5,
            transition: {
                type: "spring",
                stiffness: 300
            }
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <motion.aside
                variants={sidebarVariants}
                initial="hidden"
                animate="visible"
                className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col"
            >
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 border-b border-gray-200"
                >
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                        <Mail className="w-6 h-6 text-indigo-600" />
                        EmailApp
                    </h1>
                </motion.div>

                <nav className="flex-1 p-4 space-y-1">
                    <motion.div variants={linkVariants} whileHover="hover">
                        <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                            <LayoutDashboard className="w-5 h-5" />
                            Dashboard
                        </Link>
                    </motion.div>
                    <motion.div variants={linkVariants} whileHover="hover">
                        <Link to="/campaigns" className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                            <Mail className="w-5 h-5" />
                            Campaigns
                        </Link>
                    </motion.div>
                    <motion.div variants={linkVariants} whileHover="hover">
                        <Link to="/subscribers" className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                            <Users className="w-5 h-5" />
                            Subscribers
                        </Link>
                    </motion.div>
                    <motion.div variants={linkVariants} whileHover="hover">
                        <Link to="/lists" className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                            <Users className="w-5 h-5" />
                            Email Lists
                        </Link>
                    </motion.div>
                    <motion.div variants={linkVariants} whileHover="hover">
                        <Link to="/templates" className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                            <Mail className="w-5 h-5" />
                            Templates
                        </Link>
                    </motion.div>
                    <motion.div variants={linkVariants} whileHover="hover">
                        <Link to="/settings" className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                            <Settings className="w-5 h-5" />
                            Settings
                        </Link>
                    </motion.div>
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </motion.button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="p-8"
                >
                    <Outlet />
                </motion.div>
            </main>
        </div>
    );
}
