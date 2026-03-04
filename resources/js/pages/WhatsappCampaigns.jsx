import React, { useEffect, useState } from "react";
import {
    Plus,
    Edit,
    Trash2,
    Send,
    BarChart3,
    Calendar,
    Users,
    MessageSquare,
    Search,
    Clock,
    Copy,
    CheckCircle2,
    AlertCircle,
    Play,
    Pause,
    MoreVertical,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../lib/axios";
import { useToast } from "../context/ToastContext";
import CreateWhatsappCampaignModal from "../components/CreateWhatsappCampaignModal";
import WhatsappStatsModal from "../components/WhatsappStatsModal";

export default function WhatsappCampaigns() {
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
            const response = await api.get("/v1/whatsapp-campaigns");
            setCampaigns(response.data.Result.data || []);
        } catch (error) {
            toast.error("Failed to fetch WhatsApp campaigns");
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (campaign) => {
        if (!confirm(`Are you sure you want to send "${campaign.name}"?`))
            return;
        try {
            await api.post(`/v1/whatsapp-campaigns/${campaign.id}/send`);
            toast.success("Campaign queued for sending!");
            fetchCampaigns();
        } catch (error) {
            toast.error(
                error.response?.data?.Message || "Failed to send campaign",
            );
        }
    };

    const handleDuplicate = async (campaignId) => {
        try {
            await api.post(`/v1/whatsapp-campaigns/${campaignId}/duplicate`);
            toast.success("Campaign duplicated!");
            fetchCampaigns();
        } catch (error) {
            toast.error("Failed to duplicate campaign");
        }
    };

    const handleDelete = async (campaignId) => {
        if (!confirm("Are you sure you want to delete this campaign?")) return;
        try {
            await api.delete(`/v1/whatsapp-campaigns/${campaignId}`);
            toast.success("Campaign deleted");
            fetchCampaigns();
        } catch (error) {
            toast.error("Failed to delete campaign");
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            draft: "bg-slate-500/10 text-slate-400 border-slate-500/20",
            scheduled: "bg-blue-500/10 text-blue-400 border-blue-500/20",
            sending:
                "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 animate-pulse",
            completed:
                "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
            failed: "bg-red-500/10 text-red-400 border-red-500/20",
        };
        return (
            <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status] || styles.draft}`}
            >
                {status}
            </span>
        );
    };

    const filteredCampaigns = campaigns.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <MessageSquare className="w-8 h-8 text-emerald-400" />
                        WhatsApp Campaigns
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Drive engagement with targeted WhatsApp broadcasts
                    </p>
                </div>
                <button
                    onClick={() => {
                        setSelectedCampaign(null);
                        setShowCreateModal(true);
                    }}
                    className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    New Campaign
                </button>
            </div>

            <div className="relative group max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                <input
                    type="text"
                    placeholder="Search campaigns..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl glass-input outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="grid grid-cols-1 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="glass-card p-8 h-32 animate-pulse rounded-2xl bg-white/5"
                        />
                    ))}
                </div>
            ) : filteredCampaigns.length === 0 ? (
                <div className="glass-card p-16 text-center rounded-3xl border border-white/5">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                        <Send className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                        No campaigns yet
                    </h3>
                    <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                        Launch your first WhatsApp marketing campaign and
                        connect with your audience instantly.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    <AnimatePresence>
                        {filteredCampaigns.map((campaign) => (
                            <motion.div
                                key={campaign.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="glass-card overflow-hidden rounded-3xl group border border-white/5 hover:border-emerald-500/20 transition-all duration-500"
                            >
                                <div className="p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl -mr-32 -mt-32 group-hover:bg-emerald-500/10 transition-all duration-700" />

                                    <div className="flex-1 space-y-4 relative">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                                                {campaign.name}
                                            </h3>
                                            {getStatusBadge(campaign.status)}
                                        </div>

                                        <div className="flex flex-wrap items-center gap-6">
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <Users className="w-4 h-4 text-emerald-500/60" />
                                                <span className="text-xs font-medium">
                                                    {campaign.list?.name} (
                                                    {campaign.list
                                                        ?.contacts_count ||
                                                        0}{" "}
                                                    contacts)
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <MessageSquare className="w-4 h-4 text-emerald-500/60" />
                                                <span className="text-xs font-medium">
                                                    {campaign.template?.name}
                                                </span>
                                            </div>
                                            {campaign.scheduled_at && (
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <Calendar className="w-4 h-4 text-emerald-500/60" />
                                                    <span className="text-xs font-medium">
                                                        {new Date(
                                                            campaign.scheduled_at,
                                                        ).toLocaleString()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 relative shrink-0">
                                        <button
                                            onClick={() => {
                                                setSelectedCampaign(campaign);
                                                setShowStatsModal(true);
                                            }}
                                            className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs flex items-center gap-2 transition-all border border-white/5"
                                        >
                                            <BarChart3 className="w-4 h-4" />
                                            Stats
                                        </button>

                                        {campaign.status === "draft" && (
                                            <button
                                                onClick={() =>
                                                    handleSend(campaign)
                                                }
                                                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
                                            >
                                                <Play className="w-4 h-4" />
                                                Send Now
                                            </button>
                                        )}

                                        <div className="flex items-center gap-1 ml-2">
                                            <button
                                                onClick={() =>
                                                    handleDuplicate(campaign.id)
                                                }
                                                className="p-2.5 rounded-xl hover:bg-white/5 text-slate-500 hover:text-emerald-400 transition-all"
                                                title="Duplicate"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedCampaign(
                                                        campaign,
                                                    );
                                                    setShowCreateModal(true);
                                                }}
                                                className="p-2.5 rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-all"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(campaign.id)
                                                }
                                                className="p-2.5 rounded-xl hover:bg-white/10 text-slate-500 hover:text-red-400 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <CreateWhatsappCampaignModal
                isOpen={showCreateModal}
                onClose={() => {
                    setShowCreateModal(false);
                    setSelectedCampaign(null);
                }}
                onSuccess={fetchCampaigns}
                initialData={selectedCampaign}
            />

            <WhatsappStatsModal
                isOpen={showStatsModal}
                onClose={() => {
                    setShowStatsModal(false);
                    setSelectedCampaign(null);
                }}
                campaign={selectedCampaign}
            />
        </div>
    );
}
