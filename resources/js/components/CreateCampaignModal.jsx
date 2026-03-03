import React, { useState, useEffect } from "react";
import { X, Sparkles, Send, Layout, Clock, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../lib/axios";

export default function CreateCampaignModal({ isOpen, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        name: "",
        subject: "",
        content: "",
        email_list_id: "",
        scheduled_at: "",
    });
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchLists();
        }
    }, [isOpen]);

    const fetchLists = async () => {
        try {
            const response = await api.get("/email-lists");
            setLists(response.data.Result || []);
        } catch (error) {
            console.error("Failed to fetch lists:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/campaigns", formData);
            onSuccess();
            onClose();
            setFormData({
                name: "",
                subject: "",
                content: "",
                email_list_id: "",
                scheduled_at: "",
            });
        } catch (error) {
            console.error("Failed to create campaign");
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
                                    Create Campaign
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
                                <label className="text-sm font-medium text-slate-300 ml-1">
                                    Email Content (HTML)
                                </label>
                                <textarea
                                    required
                                    rows={6}
                                    className="w-full px-4 py-3 rounded-xl glass-input outline-none resize-none"
                                    placeholder="<h1>Hello World</h1>"
                                    value={formData.content}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            content: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                                Select a list (optional)
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
                                        Schedule (Optional)
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
