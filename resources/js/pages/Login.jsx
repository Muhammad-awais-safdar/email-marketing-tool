import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../lib/axios";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            await api.get("/sanctum/csrf-cookie", { baseURL: "/" });
            await api.post("/login", { email, password });
            window.location.href = "/dashboard";
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Invalid credentials. Please try again.",
            );
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-slate-950">
            {/* Immersive Background */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/assets/auth-bg.png"
                    alt="Background"
                    className="w-full h-full object-cover opacity-60 scale-105 animate-[pulse_10s_ease-in-out_infinite]"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-transparent to-slate-950/80" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-lg z-10"
            >
                <div className="glass-morphism rounded-3xl overflow-hidden backdrop-blur-3xl">
                    <div className="p-8 sm:p-12">
                        <div className="text-center mb-10">
                            <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-6"
                            >
                                <Sparkles className="w-3 h-3" />
                                Welcome back to EmailApp
                            </motion.div>
                            <h1 className="text-4xl font-bold text-white tracking-tight mb-3">
                                Account Login
                            </h1>
                            <p className="text-slate-400">
                                Enter your credentials to access your dashboard
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 ml-1">
                                        Email Address
                                    </label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                        <input
                                            type="email"
                                            required
                                            className="w-full pl-12 pr-4 py-4 rounded-xl glass-input outline-none"
                                            placeholder="name@company.com"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center ml-1">
                                        <label className="text-sm font-medium text-slate-300">
                                            Password
                                        </label>
                                        <Link
                                            to="/forgot-password"
                                            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                        <input
                                            type="password"
                                            required
                                            className="w-full pl-12 pr-4 py-4 rounded-xl glass-input outline-none"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
                                    >
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                disabled={isLoading}
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed shimmer"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        <div className="mt-10 text-center">
                            <p className="text-slate-400 text-sm">
                                Don't have an account?{" "}
                                <Link
                                    to="/register"
                                    className="text-white font-semibold hover:text-indigo-400 transition-colors underline decoration-indigo-500/30 underline-offset-4"
                                >
                                    Create one now
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Subtle decorative elements */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
        </div>
    );
}
