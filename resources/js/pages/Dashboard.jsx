import React, { useEffect, useState } from "react";
import {
    Mail,
    Users,
    Send,
    TrendingUp,
    Sparkles,
    ArrowUpRight,
    Calendar,
    BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "../lib/axios";
import { Link } from "react-router-dom";

export default function Dashboard() {
    const [stats, setStats] = useState({
        campaigns: 0,
        subscribers: 0,
        sent: 0,
        rate: 0,
    });
    const [recentCampaigns, setRecentCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get("/dashboard/stats");
                const data = response.data.Result;
                setStats(data.stats);
                setRecentCampaigns(data.recentCampaigns);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const statCards = [
        {
            title: "Total Campaigns",
            value: stats.campaigns,
            icon: Mail,
            color: "text-blue-400",
            glow: "bg-blue-500/20",
        },
        {
            title: "Total Subscribers",
            value: stats.subscribers,
            icon: Users,
            color: "text-indigo-400",
            glow: "bg-indigo-500/20",
        },
        {
            title: "Emails Sent",
            value: stats.sent,
            icon: Send,
            color: "text-purple-400",
            glow: "bg-purple-500/20",
        },
        {
            title: "Open Rate",
            value: `${stats.rate}%`,
            icon: TrendingUp,
            color: "text-emerald-400",
            glow: "bg-emerald-500/20",
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
            },
        },
    };

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-indigo-400 font-medium text-sm mb-1 uppercase tracking-wider">
                        <Sparkles className="w-4 h-4" />
                        Platform Performance
                    </div>
                    <h1 className="text-3xl font-bold text-white">Overview</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button className="glass-button flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Real-time Stats</span>
                    </button>
                    <Link
                        to="/campaigns"
                        className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Launch Campaign
                    </Link>
                </div>
            </div>

            {/* Stat Cards Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {statCards.map((stat, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                        className="glass-card p-6 relative overflow-hidden group"
                    >
                        <div
                            className={`absolute -top-10 -right-10 w-32 h-32 ${stat.glow} rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity`}
                        />
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-400 mb-1">
                                    {stat.title}
                                </p>
                                <motion.p
                                    initial={{ scale: 0.5 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2 + index * 0.1 }}
                                    className="text-3xl font-bold text-white"
                                >
                                    {loading ? "..." : stat.value}
                                </motion.p>
                                <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-slate-500">
                                    <span>Updated just now</span>
                                </div>
                            </div>
                            <div
                                className={`p-3 rounded-xl bg-white/5 border border-white/10 ${stat.color}`}
                            >
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Main Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 glass-card p-8 rounded-3xl"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            Recent Campaigns
                        </h2>
                        <Link
                            to="/campaigns"
                            className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                        >
                            View All
                        </Link>
                    </div>
                    <div className="space-y-6">
                        {loading ? (
                            [1, 2, 3].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-20 w-full bg-white/5 animate-pulse rounded-2xl"
                                />
                            ))
                        ) : recentCampaigns.length === 0 ? (
                            <div className="text-center py-12 bg-white/5 rounded-2xl border border-dashed border-white/10">
                                <p className="text-slate-500">
                                    No campaigns found yet.
                                </p>
                            </div>
                        ) : (
                            recentCampaigns.map((campaign) => (
                                <div
                                    key={campaign.id}
                                    className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/20">
                                            <Mail className="w-6 h-6 text-indigo-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white">
                                                {campaign.name}
                                            </h3>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                List:{" "}
                                                {campaign.email_list?.name ||
                                                    "Unassigned"}{" "}
                                                •{" "}
                                                {new Date(
                                                    campaign.created_at,
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span
                                            className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                campaign.status === "sent"
                                                    ? "bg-emerald-500/10 text-emerald-400"
                                                    : "bg-amber-500/10 text-amber-400"
                                            }`}
                                        >
                                            {campaign.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>

                {/* Performance Chart Placeholder */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card p-8 rounded-3xl flex flex-col"
                >
                    <h2 className="text-xl font-bold text-white mb-6 italic">
                        Engagement
                    </h2>
                    <div className="flex-1 flex items-center justify-center border-2 border-dashed border-white/5 rounded-2xl">
                        <div className="text-center p-4">
                            <TrendingUp className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                            <p className="text-slate-500 text-sm">
                                Analytics will appear as you send more campaigns
                            </p>
                        </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400">
                                Accuracy Boost
                            </span>
                            <span className="text-sm font-bold text-indigo-400">
                                Verified
                            </span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full w-[100%] bg-indigo-500/20" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function Plus({ className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={className}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
            />
        </svg>
    );
}
