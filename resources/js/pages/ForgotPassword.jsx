import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mail,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../lib/axios";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle"); // idle, loading, success, error
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");
        try {
            const response = await api.post("/forgot-password", { email });
            setStatus("success");
            setMessage(response.data.message);
        } catch (error) {
            setStatus("error");
            setMessage(
                error.response?.data?.message ||
                    "Something went wrong. Please try again.",
            );
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
                <div
                    className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"
                    style={{ animationDelay: "1s" }}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md z-10"
            >
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl shadow-indigo-500/20 mb-6"
                    >
                        <Mail className="w-10 h-10 text-white" />
                    </motion.div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2 flex items-center justify-center gap-2">
                        Reset Password
                        <Sparkles className="w-6 h-6 text-indigo-400" />
                    </h1>
                    <p className="text-slate-400 font-medium">
                        No worries, we'll send you reset instructions.
                    </p>
                </div>

                <div className="glass-card p-8 rounded-[2rem] border border-white/10 shadow-2xl relative">
                    <AnimatePresence mode="wait">
                        {status === "success" ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-6"
                            >
                                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">
                                    Check your email
                                </h3>
                                <p className="text-slate-400 mb-8">{message}</p>
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Login
                                </Link>
                            </motion.div>
                        ) : (
                            <motion.form
                                key="form"
                                onSubmit={handleSubmit}
                                className="space-y-6"
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                {status === "error" && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm font-medium animate-shake">
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        {message}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-300 ml-1">
                                        Email Address
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl glass-input outline-none font-medium placeholder:text-slate-600"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={status === "loading"}
                                    type="submit"
                                    className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {status === "loading" ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        "Send Reset Link"
                                    )}
                                </motion.button>

                                <div className="text-center pt-2">
                                    <Link
                                        to="/login"
                                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-bold transition-colors text-sm"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Back to Login
                                    </Link>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
