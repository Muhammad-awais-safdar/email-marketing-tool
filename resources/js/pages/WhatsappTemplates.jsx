import React, { useEffect, useState } from "react";
import {
    Plus,
    Edit,
    Trash2,
    MessageCircle,
    Search,
    Sparkles,
    Copy,
    ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../lib/axios";
import { useToast } from "../context/ToastContext";
import CreateWhatsappTemplateModal from "../components/CreateWhatsappTemplateModal";

export default function WhatsappTemplates() {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const toast = useToast();

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const response = await api.get("/v1/whatsapp-templates");
            setTemplates(response.data.Result || []);
        } catch (error) {
            toast.error("Failed to fetch WhatsApp templates");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (template) => {
        setSelectedTemplate(template);
        setShowCreateModal(true);
    };

    const handleDuplicate = async (template) => {
        try {
            await api.post("/v1/whatsapp-templates", {
                name: `${template.name} (Copy)`,
                content: template.content,
            });
            toast.success("Template duplicated successfully!");
            fetchTemplates();
        } catch (error) {
            toast.error("Failed to duplicate template.");
        }
    };

    const handleDelete = async (templateId) => {
        if (!confirm("Are you sure you want to delete this template?")) return;
        try {
            await api.delete(`/v1/whatsapp-templates/${templateId}`);
            toast.success("Template deleted successfully");
            fetchTemplates();
        } catch (error) {
            toast.error(
                "Failed to delete template. It might be in use by a campaign.",
            );
        }
    };

    const filteredTemplates = templates.filter((t) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <MessageCircle className="w-8 h-8 text-emerald-400" />
                        WhatsApp Templates
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Reusable message templates for your campaigns
                    </p>
                </div>
                <button
                    onClick={() => {
                        setSelectedTemplate(null);
                        setShowCreateModal(true);
                    }}
                    className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    New Template
                </button>
            </div>

            <div className="relative group max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                <input
                    type="text"
                    placeholder="Search templates..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl glass-input outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
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
            ) : filteredTemplates.length === 0 ? (
                <div className="glass-card p-16 text-center rounded-3xl border border-white/5">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                        <MessageCircle className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                        No templates found
                    </h3>
                    <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                        Create your first WhatsApp template to start sending
                        messages to your audience.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredTemplates.map((template) => (
                            <motion.div
                                key={template.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="glass-card p-6 rounded-2xl group flex flex-col h-full relative overflow-hidden border border-white/5"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                    <button
                                        onClick={() =>
                                            handleDuplicate(template)
                                        }
                                        className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-emerald-400 transition-all"
                                        title="Duplicate"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleEdit(template)}
                                        className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-emerald-400 transition-all"
                                        title="Edit"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDelete(template.id)
                                        }
                                        className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-red-400 transition-all"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                        <MessageCircle className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white line-clamp-1">
                                            {template.name}
                                        </h3>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                                            Standard Text
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white/5 rounded-xl p-4 border border-white/5 mb-6 flex-1 max-h-32 overflow-hidden relative">
                                    <p className="text-xs text-slate-300 italic line-clamp-4">
                                        {template.content}
                                    </p>
                                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-900/80 to-transparent" />
                                </div>

                                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                        <Sparkles className="w-3 h-3 text-emerald-400/50" />
                                        <span>Ready for use</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-emerald-500 transition-colors" />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <CreateWhatsappTemplateModal
                isOpen={showCreateModal}
                onClose={() => {
                    setShowCreateModal(false);
                    setSelectedTemplate(null);
                }}
                onSuccess={fetchTemplates}
                initialData={selectedTemplate}
            />
        </div>
    );
}
