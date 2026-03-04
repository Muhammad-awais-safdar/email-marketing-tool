import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Mail,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Sparkles,
    User,
} from "lucide-react";
import api from "../lib/axios";

export default function Layout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const location = useLocation();

    useEffect(() => {
        fetchUser();
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const fetchUser = async () => {
        try {
            const response = await api.get("/user");
            setUser(response.data.user);
        } catch (error) {
            console.error("Failed to fetch user:", error);
        }
    };

    const navItems = [
        {
            path: "/dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
            color: "text-blue-400",
        },
        {
            path: "/campaigns",
            label: "Campaigns",
            icon: Mail,
            color: "text-indigo-400",
        },
        {
            path: "/subscribers",
            label: "Subscribers",
            icon: Users,
            color: "text-purple-400",
        },
        {
            path: "/lists",
            label: "Email Lists",
            icon: Users,
            color: "text-pink-400",
        },
        {
            path: "/templates",
            label: "Templates",
            icon: Mail,
            color: "text-orange-400",
        },
        {
            path: "/settings",
            label: "Settings",
            icon: Settings,
            color: "text-slate-400",
        },
    ];

    const sidebarVariants = {
        open: { width: "280px", opacity: 1 },
        closed: { width: "80px", opacity: 1 },
    };

    const handleLogout = async () => {
        try {
            await api.post("/logout");
            window.location.href = "/login";
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[100px]" />
            </div>

            {/* Sidebar (Desktop) */}
            <motion.aside
                initial={false}
                animate={isSidebarOpen ? "open" : "closed"}
                variants={sidebarVariants}
                className="glass-nav relative z-20 hidden md:flex flex-col border-r border-white/5"
            >
                {/* Logo Area */}
                <div className="p-6 h-20 flex items-center justify-between border-b border-white/5">
                    <AnimatePresence mode="wait">
                        {isSidebarOpen ? (
                            <motion.div
                                key="logo-full"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex items-center gap-2"
                            >
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                    <Mail className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                    EmailApp
                                </span>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="logo-short"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto"
                            >
                                <Mail className="w-5 h-5 text-white" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 transition-colors"
                    >
                        {isSidebarOpen ? (
                            <X className="w-4 h-4" />
                        ) : (
                            <Menu className="w-4 h-4" />
                        )}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link key={item.path} to={item.path}>
                                <motion.div
                                    whileHover={{ x: 4 }}
                                    className={`relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group ${
                                        isActive
                                            ? "bg-white/5 text-white shadow-inner"
                                            : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                                    }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-indicator"
                                            className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-full"
                                        />
                                    )}
                                    <item.icon
                                        className={`w-5 h-5 ${item.color} ${isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100"} transition-opacity`}
                                    />
                                    {isSidebarOpen && (
                                        <span className="text-sm font-medium whitespace-nowrap">
                                            {item.label}
                                        </span>
                                    )}
                                    {isActive && isSidebarOpen && (
                                        <ChevronRight className="w-4 h-4 ml-auto text-indigo-400/50" />
                                    )}
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer/Logout */}
                <div className="p-4 border-t border-white/5 space-y-2">
                    {user && isSidebarOpen && (
                        <div className="px-3 py-3 flex items-center gap-3 bg-white/5 rounded-2xl mb-2 border border-white/5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold border border-white/20">
                                {user.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate">
                                    {user.name}
                                </p>
                                <p className="text-[10px] text-slate-500 truncate">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    )}
                    <motion.button
                        onClick={handleLogout}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-3 px-3 py-3 w-full text-left text-slate-400 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all group"
                    >
                        <LogOut className="w-5 h-5 opacity-60 group-hover:opacity-100" />
                        {isSidebarOpen && (
                            <span className="text-sm font-medium">Logout</span>
                        )}
                    </motion.button>
                </div>
            </motion.aside>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[60] md:hidden"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{
                                type: "spring",
                                damping: 25,
                                stiffness: 200,
                            }}
                            className="fixed inset-y-0 left-0 w-72 glass-nav z-[70] flex flex-col md:hidden border-r border-white/10"
                        >
                            <div className="p-6 h-20 flex items-center justify-between border-b border-white/10 bg-white/5">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-xl font-bold text-white">
                                        EmailApp
                                    </span>
                                </div>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 rounded-xl hover:bg-white/10 text-slate-400"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                                {navItems.map((item) => {
                                    const isActive =
                                        location.pathname === item.path;
                                    return (
                                        <Link key={item.path} to={item.path}>
                                            <div
                                                className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${
                                                    isActive
                                                        ? "bg-indigo-600/20 text-white border border-indigo-500/30 shadow-lg shadow-indigo-500/10"
                                                        : "text-slate-400 hover:bg-white/5"
                                                }`}
                                            >
                                                <item.icon
                                                    className={`w-6 h-6 ${item.color}`}
                                                />
                                                <span className="font-semibold">
                                                    {item.label}
                                                </span>
                                                {isActive && (
                                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500" />
                                                )}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </nav>

                            <div className="p-4 border-t border-white/10 space-y-3">
                                {user && (
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white border-2 border-white/10">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-white truncate">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-slate-500 truncate">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all font-bold"
                                >
                                    <LogOut className="w-6 h-6" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 relative z-10 flex flex-col min-w-0">
                {/* Top Header */}
                <header className="h-20 flex items-center justify-between px-4 md:px-8 bg-slate-950/20 backdrop-blur-md border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 -ml-2 rounded-xl hover:bg-white/5 text-slate-400 md:hidden transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-indigo-400" />
                            <span className="text-sm font-medium text-slate-400 hidden sm:inline">
                                {user ? (
                                    `Welcome back, ${user.name}`
                                ) : (
                                    <div className="h-4 w-32 bg-indigo-500/20 animate-pulse rounded-full border border-indigo-500/10" />
                                )}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-indigo-400" />
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="p-4 md:p-8 max-w-7xl mx-auto w-full"
                    >
                        <Outlet />
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
