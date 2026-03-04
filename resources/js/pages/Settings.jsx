import React, { useState, useEffect } from "react";
import {
    Save,
    Mail,
    Server,
    ShieldCheck,
    Globe,
    User,
    Sparkles,
    ChevronRight,
    AlertCircle,
    Info,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "../lib/axios";

export default function Settings() {
    const [formData, setFormData] = useState({
        mail_driver: "smtp",
        mail_host: "",
        mail_port: "587",
        mail_username: "",
        mail_password: "",
        mail_encryption: "tls",
        mail_from_address: "",
        mail_from_name: "",
    });
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);
    const [testStatus, setTestStatus] = useState(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await api.get("/settings");
            if (response.data.Result) {
                setFormData((prev) => ({
                    ...prev,
                    ...response.data.Result,
                }));
            }
        } catch (error) {
            console.error("Failed to fetch settings:", error);
        }
    };

    const handleTestConnection = async () => {
        setTesting(true);
        setTestStatus(null);
        try {
            const response = await api.post("/settings/test-connection", {
                settings: formData,
            });
            setTestStatus({
                type: "success",
                message: response.data.statusMessage,
            });
        } catch (error) {
            setTestStatus({
                type: "error",
                message:
                    error.response?.data?.statusMessage || "Connection failed",
            });
        } finally {
            setTesting(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post("/settings", { settings: formData });
            setTestStatus({
                type: "success",
                message: "Settings saved successfully",
            });
        } catch (error) {
            console.error("Failed to save settings:", error);
            setTestStatus({
                type: "error",
                message: "Failed to save settings",
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Server className="w-8 h-8 text-indigo-400" />
                    Infrastructure
                </h1>
                <p className="text-slate-400 mt-1">
                    Configure your SMTP gateway and sender identity
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
                {/* Main Settings */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card p-8 rounded-3xl space-y-8">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-indigo-400" />
                                SMTP Configuration
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400 ml-1">
                                        Mail Driver
                                    </label>
                                    <select
                                        className="w-full px-4 py-3 rounded-xl glass-input outline-none cursor-pointer appearance-none"
                                        value={formData.mail_driver}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                mail_driver: e.target.value,
                                            })
                                        }
                                    >
                                        <option
                                            value="smtp"
                                            className="bg-slate-900"
                                        >
                                            SMTP Server
                                        </option>
                                        <option
                                            value="sendmail"
                                            className="bg-slate-900"
                                        >
                                            Sendmail (Local)
                                        </option>
                                        <option
                                            value="mailgun"
                                            className="bg-slate-900"
                                        >
                                            Mailgun API
                                        </option>
                                        <option
                                            value="ses"
                                            className="bg-slate-900"
                                        >
                                            Amazon SES
                                        </option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400 ml-1">
                                        Host Address
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl glass-input outline-none"
                                        placeholder="smtp.example.com"
                                        value={formData.mail_host}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                mail_host: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400 ml-1">
                                        Port
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-3 rounded-xl glass-input outline-none"
                                        placeholder="587"
                                        value={formData.mail_port}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                mail_port: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400 ml-1">
                                        Encryption Protocol
                                    </label>
                                    <select
                                        className="w-full px-4 py-3 rounded-xl glass-input outline-none cursor-pointer appearance-none"
                                        value={formData.mail_encryption}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                mail_encryption: e.target.value,
                                            })
                                        }
                                    >
                                        <option
                                            value="tls"
                                            className="bg-slate-900"
                                        >
                                            TLS (Recommended)
                                        </option>
                                        <option
                                            value="ssl"
                                            className="bg-slate-900"
                                        >
                                            SSL
                                        </option>
                                        <option
                                            value="none"
                                            className="bg-slate-900"
                                        >
                                            Disabled (Unsecure)
                                        </option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400 ml-1">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl glass-input outline-none"
                                        placeholder="apikey or email"
                                        value={formData.mail_username}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                mail_username: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400 ml-1">
                                        Password / API Key
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-3 rounded-xl glass-input outline-none font-sans"
                                        placeholder="••••••••••••"
                                        value={formData.mail_password}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                mail_password: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/5">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <User className="w-5 h-5 text-indigo-400" />
                                Sender Identity
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400 ml-1">
                                        From Name
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl glass-input outline-none"
                                        placeholder="Marketing Team"
                                        value={formData.mail_from_name}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                mail_from_name: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400 ml-1">
                                        From Email
                                    </label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-3 rounded-xl glass-input outline-none"
                                        placeholder="noreply@yourbrand.com"
                                        value={formData.mail_from_address}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                mail_from_address:
                                                    e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="glass-card p-6 rounded-3xl border-indigo-500/20 bg-indigo-500/5">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4">
                            <ShieldCheck className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h4 className="text-white font-bold mb-2">
                            Security Advice
                        </h4>
                        <p className="text-sm text-slate-400 leading-relaxed mb-4">
                            Never use your primary account password. Most
                            providers require an <strong>App Password</strong>{" "}
                            or <strong>API Key</strong> for third-party
                            connections.
                        </p>
                        <a
                            href="#"
                            className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1 hover:text-indigo-300 transition-colors"
                        >
                            Guide to App Passwords
                            <ChevronRight className="w-3 h-3" />
                        </a>
                    </div>

                    <div className="glass-card p-6 rounded-3xl">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center mb-4 border border-white/5">
                            <AlertCircle className="w-6 h-6 text-slate-400" />
                        </div>
                        <h4 className="text-white font-bold mb-2">
                            Connection Test
                        </h4>
                        <p className="text-sm text-slate-500 leading-relaxed mb-6">
                            Save your settings first, then perform a delivery
                            test to ensure everything is wired correctly.
                        </p>

                        {testStatus && (
                            <div
                                className={`mb-4 p-3 rounded-xl text-xs font-medium border ${
                                    testStatus.type === "success"
                                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                        : "bg-red-500/10 border-red-500/20 text-red-400"
                                }`}
                            >
                                {testStatus.message}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handleTestConnection}
                            disabled={testing}
                            className="w-full py-3 rounded-xl border border-white/10 text-slate-400 text-sm font-bold hover:bg-white/5 transition-all text-center uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                            {testing ? (
                                <div className="w-4 h-4 border-2 border-slate-400/30 border-t-slate-400 rounded-full animate-spin" />
                            ) : (
                                "Test Connection"
                            )}
                        </button>
                    </div>

                    <div className="pt-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={saving}
                            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 group"
                        >
                            {saving ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Save Platform Settings
                                    <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </>
                            )}
                        </motion.button>
                        <p className="text-center text-[11px] text-slate-600 mt-4 uppercase tracking-[0.2em]">
                            Changes apply instantly
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
}
