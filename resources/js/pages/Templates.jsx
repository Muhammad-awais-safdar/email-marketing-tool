import React, { useEffect, useState } from "react";
import {
    Plus,
    Edit,
    Trash2,
    FileText,
    Sparkles,
    X,
    Code,
    Layout,
    Palette,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../lib/axios";
import VisualTemplateEditor from "../components/VisualTemplateEditor";

export default function Templates() {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showVisualEditor, setShowVisualEditor] = useState(false);
    const [formData, setFormData] = useState({ name: "", content: "" });

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const response = await api.get("/templates");
            setTemplates(response.data.Result || []);
        } catch (error) {
            console.error("Failed to fetch templates:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await saveTemplate(formData);
    };

    const saveTemplate = async (data) => {
        try {
            await api.post("/templates", data);
            fetchTemplates();
            setShowCreateModal(false);
            setShowVisualEditor(false);
            setFormData({ name: "", content: "" });
        } catch (error) {
            console.error("Failed to save template");
        }
    };

    const handleDelete = async (templateId) => {
        if (!confirm("Are you sure you want to delete this template?")) return;
        try {
            await api.delete(`/templates/${templateId}`);
            fetchTemplates();
        } catch (error) {
            console.error("Failed to delete template");
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <FileText className="w-8 h-8 text-indigo-400" />
                        Email Templates
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Reusable layouts for consistent communication
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowVisualEditor(true)}
                        className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold transition-all flex items-center gap-2 group"
                    >
                        <Palette className="w-4 h-4 text-indigo-400 group-hover:rotate-12 transition-transform" />
                        Visual Designer
                    </button>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 group"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                        Code Template
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2].map((i) => (
                        <div
                            key={i}
                            className="glass-card p-6 h-64 animate-pulse rounded-3xl bg-white/5"
                        />
                    ))}
                </div>
            ) : templates.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-16 text-center rounded-3xl"
                >
                    <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-6">
                        <Layout className="w-10 h-10 text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                        No templates yet
                    </h3>
                    <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                        Design reusable email skeletons to save time and
                        maintain brand consistency.
                    </p>
                    <button
                        onClick={() => setShowVisualEditor(true)}
                        className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold transition-all"
                    >
                        Launch Designer
                    </button>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatePresence>
                        {templates.map((template) => (
                            <motion.div
                                key={template.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="glass-card flex flex-col rounded-3xl group relative overflow-hidden h-[400px]"
                            >
                                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-white/5">
                                            <Code className="w-5 h-5 text-indigo-400" />
                                        </div>
                                        <h3 className="text-lg font-bold text-white tracking-tight uppercase line-clamp-1">
                                            {template.name}
                                        </h3>
                                    </div>
                                    <div className="flex gap-1">
                                        <button className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-indigo-400 transition-all">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(template.id)
                                            }
                                            className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-red-400 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex-1 p-6 overflow-hidden relative">
                                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10" />
                                    <pre className="text-[10px] text-slate-500 font-mono whitespace-pre-wrap leading-relaxed opacity-60">
                                        {template.content}
                                    </pre>
                                </div>
                                <div className="p-6 pt-0 mt-auto">
                                    <button className="w-full py-2.5 rounded-xl border border-white/10 text-xs font-bold text-slate-400 uppercase tracking-widest hover:bg-white/5 transition-all">
                                        Preview Template
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Code Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCreateModal(false)}
                            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="glass-card w-full max-w-2xl rounded-3xl overflow-hidden relative z-10 shadow-2xl border-white/10"
                        >
                            <div className="p-6 h-20 flex items-center justify-between border-b border-white/5 bg-white/5">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                        <FileText className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white tracking-tight">
                                        Code Template
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="p-2 hover:bg-white/5 rounded-xl text-slate-400 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="p-8 space-y-6"
                            >
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 ml-1">
                                        Template Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-xl glass-input outline-none"
                                        placeholder="Marketing Master 2.0"
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
                                        <Code className="w-3.5 h-3.5" />
                                        HTML Content
                                    </label>
                                    <textarea
                                        required
                                        rows={12}
                                        className="w-full px-4 py-3 rounded-xl glass-input outline-none font-mono text-sm leading-relaxed"
                                        placeholder="<div style='color: blue'>...</div>"
                                        value={formData.content}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                content: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowCreateModal(false)
                                        }
                                        className="px-6 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm font-semibold"
                                    >
                                        Cancel
                                    </button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 group"
                                    >
                                        Save Template
                                        <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Visual Editor Overlay */}
            <VisualTemplateEditor
                isOpen={showVisualEditor}
                onClose={() => setShowVisualEditor(false)}
                onSave={saveTemplate}
            />
        </div>
    );
}
