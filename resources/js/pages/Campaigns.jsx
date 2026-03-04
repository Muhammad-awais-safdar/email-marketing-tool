import React, { useEffect, useState } from "react";
import {
    Plus,
    Send,
    Edit,
    Trash2,
    Mail,
    Sparkles,
    Search,
    Filter,
    Users,
    Copy,
    BarChart2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../lib/axios";
import CreateCampaignModal from "../components/CreateCampaignModal";
import CampaignStatsModal from "../components/CampaignStatsModal";
import { useToast } from "../context/ToastContext";

export default function Campaigns() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showStatsModal, setShowStatsModal] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const toast = useToast();

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            setLoading(true);
            const response = await api.get("/campaigns");
            setCampaigns(response.data.Result?.data || []);
        } catch (error) {
            toast.error("Failed to load campaigns. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (campaignId) => {
        try {
            await api.post(`/campaigns/${campaignId}/send`);
            toast.success("Campaign queued for sending!");
            fetchCampaigns();
        } catch (error) {
            toast.error(
                "Failed to queue campaign. Please check your settings.",
            );
        }
    };

    const handleEdit = (campaign) => {
        setSelectedCampaign(campaign);
        setShowCreateModal(true);
    };

    const handleDuplicate = async (campaign) => {
        try {
            await api.post("/campaigns", {
                name: `${campaign.name} (Copy)`,
                subject: campaign.subject,
                content: campaign.content,
                email_list_id: campaign.email_list_id,
            });
            toast.success("Campaign duplicated successfully!");
            fetchCampaigns();
        } catch (error) {
            toast.error("Failed to duplicate campaign. Please try again.");
        }
    };

    const handleDelete = async (campaignId) => {
        if (!confirm("Are you sure you want to delete this campaign?")) return;
        try {
            await api.delete(`/campaigns/${campaignId}`);
            toast.success("Campaign deleted successfully.");
            fetchCampaigns();
        } catch (error) {
            toast.error("Failed to delete campaign. It might be in use.");
        }
    };

    const filteredCampaigns = campaigns.filter(
        (c) =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.subject.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <div className="space-y-8">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Mail className="w-8 h-8 text-indigo-400" />
                        Campaigns
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Manage and track your email marketing efforts
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    New Campaign
                </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search campaigns..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl glass-input outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className="glass-button flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    All Statuses
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="glass-card p-6 h-48 animate-pulse rounded-2xl bg-white/5"
                        />
                    ))}
                </div>
            ) : filteredCampaigns.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-16 text-center rounded-3xl"
                >
                    <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-6">
                        <Mail className="w-10 h-10 text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                        No campaigns found
                    </h3>
                    <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                        Start reaching your audience by creating your first
                        automated email campaign.
                    </p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold transition-all"
                    >
                        Get Started
                    </button>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredCampaigns.map((campaign) => (
                            <motion.div
                                key={campaign.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="glass-card p-6 rounded-2xl flex flex-col group h-full"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span
                                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                                            campaign.status === "sent"
                                                ? "bg-emerald-500/10 text-emerald-400"
                                                : campaign.status === "sending"
                                                  ? "bg-blue-500/10 text-blue-400"
                                                  : "bg-indigo-500/10 text-indigo-400"
                                        }`}
                                    >
                                        {campaign.status}
                                    </span>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {campaign.status === "draft" && (
                                            <button
                                                onClick={() =>
                                                    handleSend(campaign.id)
                                                }
                                                className="p-1.5 rounded-lg hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                                                title="Send Now"
                                            >
                                                <Send className="w-4 h-4" />
                                            </button>
                                        )}
                                        {campaign.status !== "draft" && (
                                            <button
                                                onClick={() => {
                                                    setSelectedCampaign(
                                                        campaign,
                                                    );
                                                    setShowStatsModal(true);
                                                }}
                                                className="p-1.5 rounded-lg hover:bg-indigo-500/20 text-indigo-400 transition-colors"
                                                title="View Stats"
                                            >
                                                <BarChart2 className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() =>
                                                handleDuplicate(campaign)
                                            }
                                            className="p-1.5 rounded-lg hover:bg-slate-500/20 text-slate-400 transition-colors"
                                            title="Duplicate"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(campaign)}
                                            className="p-1.5 rounded-lg hover:bg-blue-500/20 text-blue-400 transition-colors"
                                            title="Edit"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(campaign.id)
                                            }
                                            className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
                                    {campaign.name}
                                </h3>
                                <p className="text-sm text-slate-400 mb-6 line-clamp-2">
                                    {campaign.subject}
                                </p>

                                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-medium text-slate-500">
                                    <div className="flex items-center gap-1.5">
                                        <Sparkles className="w-3.5 h-3.5 text-indigo-400/50" />
                                        <span>
                                            Created{" "}
                                            {new Date(
                                                campaign.created_at,
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="flex items-center gap-1 font-bold text-slate-300">
                                            <Users className="w-3.5 h-3.5 text-indigo-400" />
                                            <span>
                                                {campaign.email_list
                                                    ?.subscribers_count || 0}
                                            </span>
                                        </div>
                                        <span className="text-[9px] text-slate-600 uppercase tracking-tighter truncate max-w-[80px]">
                                            {campaign.email_list?.name ||
                                                "No List"}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <CreateCampaignModal
                isOpen={showCreateModal}
                initialData={selectedCampaign}
                onClose={() => {
                    setShowCreateModal(false);
                    setSelectedCampaign(null);
                }}
                onSuccess={() => {
                    fetchCampaigns();
                    setSelectedCampaign(null);
                }}
            />

            <CampaignStatsModal
                isOpen={showStatsModal}
                campaign={selectedCampaign}
                onClose={() => {
                    setShowStatsModal(false);
                    setSelectedCampaign(null);
                }}
            />
        </div>
    );
}
