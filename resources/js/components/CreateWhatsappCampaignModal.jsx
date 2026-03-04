import React, { useState, useEffect } from "react";
import {
    X,
    Sparkles,
    MessageSquare,
    CheckCircle2,
    Calendar,
    Users,
    ChevronDown,
    Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../lib/axios";
import { useToast } from "../context/ToastContext";

export default function CreateWhatsappCampaignModal({
    isOpen,
    onClose,
    onSuccess,
    initialData = null,
}) {
    const [formData, setFormData] = useState({
        name: "",
        whatsapp_list_id: "",
        whatsapp_template_id: "",
        scheduled_at: "",
        send_delay: 0,
    });
    const [lists, setLists] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    useEffect(() => {
        if (isOpen) {
            fetchData();
            if (initialData) {
                setFormData({
                    name: initialData.name,
                    whatsapp_list_id: initialData.whatsapp_list_id,
                    whatsapp_template_id: initialData.whatsapp_template_id,
                    scheduled_at: initialData.scheduled_at
                        ? initialData.scheduled_at.split(".")[0].slice(0, 16)
                        : "",
                    send_delay: initialData.send_delay || 0,
                });
            } else {
                setFormData({
                    name: "",
                    whatsapp_list_id: "",
                    whatsapp_template_id: "",
                    scheduled_at: "",
                    send_delay: 0,
                });
            }
        }
    }, [isOpen, initialData]);

    const fetchData = async () => {
        try {
            const [listsRes, templatesRes] = await Promise.all([
                api.get("/v1/whatsapp-lists"),
                api.get("/v1/whatsapp-templates"),
            ]);
            setLists(listsRes.data.Result || []);
            setTemplates(templatesRes.data.Result || []);
        } catch (error) {
            toast.error("Failed to load options for campaign.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (initialData?.id) {
                await api.put(
                    `/v1/whatsapp-campaigns/${initialData.id}`,
                    formData,
                );
                toast.success("Campaign updated!");
            } else {
                await api.post("/v1/whatsapp-campaigns", formData);
                toast.success("Campaign created!");
            }
            onSuccess();
            onClose();
        } catch (error) {
            toast.error("Failed to save campaign. Please check your data.");
        } finally {
            setLoading(false);
        }
    };

    const selectedTemplate = templates.find(
        (t) => t.id == formData.whatsapp_template_id,
    );

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
                        className="glass-card w-full max-w-2xl rounded-3xl overflow-hidden relative z-10 shadow-2xl border border-white/10"
                    >
                        {/* Header */}
                        <div className="p-6 h-20 flex items-center justify-between border-b border-white/5 bg-white/5">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                    <MessageSquare className="w-5 h-5 text-emerald-400" />
                                </div>
                                <h2 className="text-xl font-bold text-white tracking-tight">
                                    {initialData
                                        ? "Edit Campaign"
                                        : "New WhatsApp Campaign"}
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
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300 ml-1">
                                            Campaign Name
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 rounded-xl glass-input outline-none"
                                            placeholder="E.g. Spring Sale Announcement"
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
                                            <Users className="w-3.5 h-3.5" />
                                            WhatsApp List
                                        </label>
                                        <div className="relative group">
                                            <select
                                                required
                                                className="w-full px-4 py-3 rounded-xl glass-input outline-none appearance-none cursor-pointer"
                                                value={
                                                    formData.whatsapp_list_id
                                                }
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        whatsapp_list_id:
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
                                                        {list.name} (
                                                        {list.contacts_count ||
                                                            0}{" "}
                                                        contacts)
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none group-focus-within:text-emerald-400 transition-colors" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300 ml-1 flex items-center gap-2">
                                            <MessageSquare className="w-3.5 h-3.5" />
                                            Select Template
                                        </label>
                                        <div className="relative group">
                                            <select
                                                required
                                                className="w-full px-4 py-3 rounded-xl glass-input outline-none appearance-none cursor-pointer"
                                                value={
                                                    formData.whatsapp_template_id
                                                }
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        whatsapp_template_id:
                                                            e.target.value,
                                                    })
                                                }
                                            >
                                                <option
                                                    value=""
                                                    className="bg-slate-900"
                                                >
                                                    Select a template
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
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none group-focus-within:text-emerald-400 transition-colors" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300 ml-1 flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5" />
                                            Schedule (Optional)
                                        </label>
                                        <input
                                            type="datetime-local"
                                            className="w-full px-4 py-3 rounded-xl glass-input outline-none"
                                            value={formData.scheduled_at}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    scheduled_at:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300 ml-1 flex items-center gap-2">
                                            <Clock className="w-3.5 h-3.5" />
                                            Sending Delay (Seconds)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="3600"
                                            className="w-full px-4 py-3 rounded-xl glass-input outline-none"
                                            placeholder="0 to 3600"
                                            value={formData.send_delay}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    send_delay:
                                                        parseInt(
                                                            e.target.value,
                                                        ) || 0,
                                                })
                                            }
                                        />
                                        <p className="text-[10px] text-slate-500 italic ml-1">
                                            Delay between each message for
                                            better delivery.
                                        </p>
                                    </div>

                                    {/* Mini Preview */}
                                    <div className="glass-card p-4 rounded-xl border border-white/5 bg-slate-900/50 flex-1">
                                        <span className="text-[10px] font-bold text-emerald-400/60 uppercase tracking-widest mb-2 block">
                                            Template Preview
                                        </span>
                                        {selectedTemplate ? (
                                            <p className="text-[11px] text-slate-300 line-clamp-3 italic">
                                                "{selectedTemplate.content}"
                                            </p>
                                        ) : (
                                            <p className="text-[11px] text-slate-600 italic">
                                                Select a template to preview...
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/5">
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
                                    className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/20 disabled:opacity-50 transition-all flex items-center gap-2 group"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            {initialData
                                                ? "Update Campaign"
                                                : "Create Campaign"}
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
