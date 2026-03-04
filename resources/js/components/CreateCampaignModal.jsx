import React, { useState, useEffect } from "react";
import {
    X,
    Sparkles,
    Send,
    Layout,
    Clock,
    ChevronDown,
    Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../lib/axios";

export default function CreateCampaignModal({
    isOpen,
    onClose,
    onSuccess,
    initialData,
}) {
    const [formData, setFormData] = useState({
        name: "",
        subject: "",
        content: "",
        email_list_id: "",
        status: "draft",
        send_delay: 10,
        scheduled_at: "",
    });
    const [lists, setLists] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchLists();
            fetchTemplates();
            if (initialData) {
                setFormData({
                    name: initialData.name || "",
                    subject: initialData.subject || "",
                    content: initialData.content || "",
                    email_list_id: initialData.email_list_id || "",
                    status: initialData.status || "draft",
                    send_delay: initialData.send_delay ?? 10,
                    scheduled_at: initialData.scheduled_at
                        ? new Date(initialData.scheduled_at)
                              .toISOString()
                              .slice(0, 16)
                        : "",
                });
            } else {
                setFormData({
                    name: "",
                    subject: "",
                    content: "",
                    email_list_id: "",
                    status: "draft",
                    send_delay: 10,
                    scheduled_at: "",
                });
            }
        }
    }, [isOpen, initialData]);

    const fetchLists = async () => {
        try {
            const response = await api.get("/email-lists");
            setLists(response.data.Result || []);
        } catch (error) {
            console.error("Failed to fetch lists:", error);
        }
    };

    const fetchTemplates = async () => {
        try {
            const response = await api.get("/templates");
            const result = response.data.Result;
            // Handle both array-based and object-based results (pagination vs all)
            setTemplates(result?.data || result || []);
        } catch (error) {
            console.error("Failed to fetch templates:", error);
        }
    };

    const [selectedTemplateId, setSelectedTemplateId] = useState("");

    const handleTemplateChange = (templateId) => {
        setSelectedTemplateId(templateId);
        const selected = templates.find((t) => t.id === parseInt(templateId));
        if (selected) {
            setFormData({
                ...formData,
                subject: selected.subject || formData.subject,
                content: selected.content,
            });
            // Auto-disable preview mode to show the template is loaded
            setPreviewMode(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (initialData?.id) {
                await api.put(`/campaigns/${initialData.id}`, formData);
            } else {
                await api.post("/campaigns", formData);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to save campaign");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="glass-card w-full max-w-2xl rounded-3xl overflow-hidden relative z-10 shadow-2xl border-white/10"
                    >
                        {/* Header */}
                        <div className="p-6 h-20 flex items-center justify-between border-b border-white/5 bg-white/5">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                    <Sparkles className="w-5 h-5 text-indigo-400" />
                                </div>
                                <h2 className="text-xl font-bold text-white tracking-tight">
                                    {initialData?.id
                                        ? "Edit Campaign"
                                        : "Create Campaign"}
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/5 rounded-xl text-slate-400 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 ml-1 flex items-center gap-2">
                                        <Layout className="w-3.5 h-3.5" />
                                        Campaign Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-xl glass-input outline-none"
                                        placeholder="August Newsletter"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                name: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 ml-1 flex items-center gap-2">
                                        <Send className="w-3.5 h-3.5" />
                                        Email Subject
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-xl glass-input outline-none"
                                        placeholder="Exciting News!"
                                        value={formData.subject}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                subject: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 ml-1 flex items-center gap-2">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Base Template (Optional)
                                </label>
                                <div className="relative group">
                                    <select
                                        value={selectedTemplateId}
                                        onChange={(e) =>
                                            handleTemplateChange(e.target.value)
                                        }
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer"
                                    >
                                        <option
                                            value=""
                                            className="bg-slate-900"
                                        >
                                            Manual HTML Editor (No Template)
                                        </option>
                                        {templates.map((template) => (
                                            <option
                                                key={template.id}
                                                value={template.id}
                                                className="bg-slate-900"
                                            >
                                                {template.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none group-focus-within:text-indigo-400 transition-colors" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <Layout className="w-3.5 h-3.5 text-indigo-400" />
                                        Campaign Content
                                    </label>
                                    {!selectedTemplateId && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setPreviewMode(!previewMode)
                                            }
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all text-[10px] font-bold uppercase tracking-wider border border-indigo-500/20"
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                            {previewMode
                                                ? "Edit HTML"
                                                : "Live Preview"}
                                        </button>
                                    )}
                                </div>

                                {selectedTemplateId ? (
                                    <div className="glass-card p-6 rounded-2xl border-indigo-500/20 bg-indigo-500/5 flex flex-col items-center justify-center text-center space-y-3">
                                        <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center">
                                            <Sparkles className="w-6 h-6 text-indigo-400" />
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-sm">
                                                Template Linked
                                            </p>
                                            <p className="text-slate-400 text-xs mt-1">
                                                The professional layout from
                                                your selected template will be
                                                used.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedTemplateId("");
                                                setFormData({
                                                    ...formData,
                                                    content: "",
                                                });
                                            }}
                                            className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors pt-2"
                                        >
                                            Clear Template & Edit Manually
                                        </button>
                                    </div>
                                ) : (
                                    <div className="relative group">
                                        {previewMode ? (
                                            <div className="w-full h-[300px] rounded-2xl bg-white border border-white/10 overflow-hidden shadow-2xl">
                                                <iframe
                                                    srcDoc={formData.content}
                                                    className="w-full h-full border-none"
                                                    title="Campaign Preview"
                                                />
                                            </div>
                                        ) : (
                                            <textarea
                                                required
                                                rows={10}
                                                value={formData.content}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        content: e.target.value,
                                                    })
                                                }
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white text-sm outline-none focus:border-indigo-500/50 transition-all font-mono min-h-[250px] resize-none scrollbar-hide"
                                                placeholder="Paste your HTML here or select a template above..."
                                            />
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 ml-1">
                                        Target Audience
                                    </label>
                                    <div className="relative group">
                                        <select
                                            className="w-full px-4 py-3 rounded-xl glass-input outline-none appearance-none cursor-pointer"
                                            value={formData.email_list_id}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    email_list_id:
                                                        e.target.value,
                                                })
                                            }
                                        >
                                            <option
                                                value=""
                                                className="bg-slate-900"
                                            >
                                                Select a list
                                            </option>
                                            {lists.map((list) => (
                                                <option
                                                    key={list.id}
                                                    value={list.id}
                                                    className="bg-slate-900"
                                                >
                                                    {list.name}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none group-focus-within:text-indigo-400 transition-colors" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 ml-1 flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5" />
                                        Schedule
                                    </label>
                                    <input
                                        type="datetime-local"
                                        className="w-full px-4 py-3 rounded-xl glass-input outline-none"
                                        value={formData.scheduled_at}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                scheduled_at: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 ml-1 flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5" />
                                        Delay (Sec)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="3600"
                                        className="w-full px-4 py-3 rounded-xl glass-input outline-none"
                                        placeholder="10"
                                        value={formData.send_delay}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                send_delay: parseInt(e.target.value) || 0,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm font-semibold"
                                >
                                    Cancel
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition-all flex items-center gap-2 group"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Save Campaign
                                            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
