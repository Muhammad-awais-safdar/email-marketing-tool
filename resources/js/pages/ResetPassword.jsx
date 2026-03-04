import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Lock,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Sparkles,
    Eye,
    EyeOff,
} from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import api from "../lib/axios";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [token, setToken] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");

    useEffect(() => {
        setToken(searchParams.get("token") || "");
        setEmail(searchParams.get("email") || "");
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");
        try {
            await api.post("/reset-password", {
                token,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });
            setStatus("success");
            setTimeout(() => navigate("/login"), 3000);
        } catch (error) {
            setStatus("error");
            setMessage(
                error.response?.data?.message || "Failed to reset password.",
            );
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans">
            <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md z-10"
            >
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ rotate: -10 }}
                        animate={{ rotate: 0 }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl shadow-indigo-500/20 mb-6"
                    >
                        <Lock className="w-10 h-10 text-white" />
                    </motion.div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2 flex items-center justify-center gap-2">
                        Set New Password
                        <Sparkles className="w-6 h-6 text-indigo-400" />
                    </h1>
                    <p className="text-slate-400 font-medium">
                        Please enter your new secure password.
                    </p>
                </div>

                <div className="glass-card p-8 rounded-[2rem] border border-white/10 shadow-2xl">
                    {status === "success" ? (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">
                                Password Reset!
                            </h3>
                            <p className="text-slate-400 mb-4">
                                Your password has been updated successfully.
                            </p>
                            <p className="text-xs text-indigo-400 font-bold animate-pulse">
                                Redirecting to login...
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {status === "error" && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm font-medium">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    {message}
                                </div>
                            )}

                            <input type="hidden" value={token} />
                            <input type="hidden" value={email} />

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-300 ml-1">
                                    New Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        required
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        className="w-full pl-12 pr-12 py-4 rounded-2xl glass-input outline-none font-medium text-white"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-300 ml-1">
                                    Confirm New Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        required
                                        value={passwordConfirmation}
                                        onChange={(e) =>
                                            setPasswordConfirmation(
                                                e.target.value,
                                            )
                                        }
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl glass-input outline-none font-medium text-white"
                                        placeholder="••••••••"
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
                                    "Reset Password"
                                )}
                            </motion.button>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
