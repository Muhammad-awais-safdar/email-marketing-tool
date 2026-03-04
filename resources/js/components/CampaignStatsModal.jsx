import React, { useState, useEffect } from "react";
import {
    X,
    CheckCircle2,
    XCircle,
    Users,
    Mail,
    Calendar,
    Search,
    ChevronLeft,
    ChevronRight,
    AlertCircle,
    TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../lib/axios";

export default function CampaignStatsModal({ isOpen, onClose, campaign }) {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (isOpen && campaign?.id) {
            fetchStats();
        }
    }, [isOpen, campaign]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/campaigns/${campaign.id}/stats`);
            setStats(response.data.Result);
        } catch (error) {
            console.error("Failed to fetch campaign stats:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!campaign) return null;

    const filteredLogs =
        stats?.logs?.filter(
            (log) =>
                (log.subscriber_name || "")
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                (log.subscriber_email || "")
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()),
        ) || [];

    const StatCard = ({ title, value, subValue, icon: Icon, color }) => (
        <div className="glass-card p-5 rounded-2xl relative overflow-hidden group border-white/5 bg-white/5">
            <div
                className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-${color}-500/10 blur-3xl group-hover:bg-${color}-500/20 transition-all duration-500`}
            />
            <div className="relative flex items-center gap-4">
                <div
                    className={`w-12 h-12 rounded-xl bg-${color}-500/10 flex items-center justify-center border border-${color}-500/20`}
                >
                    <Icon className={`w-6 h-6 text-${color}-400`} />
                </div>
                <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        {title}
                    </h4>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl font-black text-white">
                            {value}
                        </span>
                        {subValue && (
                            <span className="text-xs font-semibold text-slate-500">
                                {subValue}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="glass-card w-full max-w-4xl mx-auto rounded-3xl overflow-hidden relative z-10 shadow-3xl border-white/10 flex flex-col min-h-[400px] max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="p-6 flex items-center justify-between border-b border-white/5 bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                    <TrendingUp className="w-6 h-6 text-indigo-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white tracking-tight">
                                        Campaign Report
                                    </h2>
                                    <p className="text-xs text-slate-500 font-medium">
                                        {campaign.name}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/5 rounded-xl text-slate-400 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {loading ? (
                            <div className="p-20 flex flex-col items-center justify-center">
                                <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
                                <p className="text-slate-400 font-medium animate-pulse">
                                    Analyzing delivery data...
                                </p>
                            </div>
                        ) : (
                            <div className="p-8 space-y-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
                                {/* Dashboard Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <StatCard
                                        title="Total Targeted"
                                        value={stats?.total || 0}
                                        icon={Users}
                                        color="indigo"
                                    />
                                    <StatCard
                                        title="Emails Delivered"
                                        value={stats?.sent || 0}
                                        subValue={`${stats?.total > 0 ? Math.round((stats?.sent / stats?.total) * 100) : 0}%`}
                                        icon={CheckCircle2}
                                        color="emerald"
                                    />
                                    <StatCard
                                        title="Failures"
                                        value={stats?.failed || 0}
                                        subValue={`${stats?.total > 0 ? Math.round((stats?.failed / stats?.total) * 100) : 0}%`}
                                        icon={XCircle}
                                        color="red"
                                    />
                                </div>

                                {/* Detailed Logs */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between px-1">
                                        <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-indigo-400" />
                                            Detailed Delivery Logs
                                        </h3>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                                            <input
                                                type="text"
                                                placeholder="Search subscriber..."
                                                value={searchTerm}
                                                onChange={(e) =>
                                                    setSearchTerm(
                                                        e.target.value,
                                                    )
                                                }
                                                className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white outline-none focus:border-indigo-500/50 transition-all w-64"
                                            />
                                        </div>
                                    </div>

                                    <div className="glass-card rounded-2xl border-white/5 bg-white/2 overflow-hidden overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b border-white/5 bg-white/5">
                                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                                        Subscriber
                                                    </th>
                                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                                        Status
                                                    </th>
                                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                                        Sent At
                                                    </th>
                                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                                        Details
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {filteredLogs.map((log) => (
                                                    <tr
                                                        key={log.id}
                                                        className="hover:bg-white/[0.02] transition-colors"
                                                    >
                                                        <td className="px-6 py-4">
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-bold text-white">
                                                                    {
                                                                        log.subscriber_name
                                                                    }
                                                                </span>
                                                                <span className="text-xs text-slate-500">
                                                                    {
                                                                        log.subscriber_email
                                                                    }
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span
                                                                className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                                    log.status ===
                                                                    "sent"
                                                                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                                                                }`}
                                                            >
                                                                {log.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                                                <Calendar className="w-3.5 h-3.5 text-slate-600" />
                                                                {new Date(
                                                                    log.sent_at,
                                                                ).toLocaleString()}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {log.error ? (
                                                                <div className="flex items-center gap-2 text-xs text-red-400/80 italic max-w-[200px] truncate group relative">
                                                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                                                    {log.error}
                                                                    <div className="absolute bottom-full left-0 mb-2 p-2 bg-slate-900 border border-red-500/20 rounded-lg text-[10px] text-white whitespace-normal opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 w-48 shadow-2xl">
                                                                        {
                                                                            log.error
                                                                        }
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <span className="text-xs text-slate-600">
                                                                    No issues
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                                {filteredLogs.length === 0 && (
                                                    <tr>
                                                        <td
                                                            colSpan="4"
                                                            className="px-6 py-12 text-center"
                                                        >
                                                            <div className="flex flex-col items-center gap-3">
                                                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                                                    <Mail className="w-6 h-6 text-slate-600" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-slate-400 font-medium">
                                                                        No
                                                                        delivery
                                                                        records
                                                                        found
                                                                        yet.
                                                                    </p>
                                                                    <p className="text-xs text-slate-600 mt-1 max-w-[280px] mx-auto">
                                                                        If you
                                                                        just
                                                                        started
                                                                        the
                                                                        campaign,
                                                                        please
                                                                        wait a
                                                                        few
                                                                        moments
                                                                        for the
                                                                        queue to
                                                                        process.
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="p-6 border-t border-white/5 bg-white/2 flex justify-between items-center">
                            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">
                                Data synchronized with live mail server
                            </p>
                            <button
                                onClick={onClose}
                                className="px-6 py-2 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-all text-xs font-bold"
                            >
                                Close Report
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
