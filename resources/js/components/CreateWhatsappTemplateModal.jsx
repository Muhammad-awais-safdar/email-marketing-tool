import React, { useState, useEffect } from "react";
import {
    X,
    FileText,
    Sparkles,
    MessageCircle,
    CheckCircle2,
    Info,
    Bold,
    Italic,
    Strikethrough,
    Smartphone,
    User,
    Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../lib/axios";
import { useToast } from "../context/ToastContext";

export default function CreateWhatsappTemplateModal({
    isOpen,
    onClose,
    onSuccess,
    initialData = null,
}) {
    const [formData, setFormData] = useState({
        name: "",
        content: "",
    });
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    name: initialData.name,
                    content: initialData.content,
                });
            } else {
                setFormData({ name: "", content: "" });
            }
        }
    }, [isOpen, initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (initialData?.id) {
                await api.put(
                    `/v1/whatsapp-templates/${initialData.id}`,
                    formData,
                );
                toast.success("Template updated successfully!");
            } else {
                await api.post("/v1/whatsapp-templates", formData);
                toast.success("Template created successfully!");
            }
            onSuccess();
            onClose();
        } catch (error) {
            toast.error("Failed to save template. Please check the input.");
        } finally {
            setLoading(false);
        }
    };

    const insertVariable = (variable) => {
        setFormData({
            ...formData,
            content: formData.content + ` {{${variable}}}`,
        });
    };

    const applyFormatting = (symbol) => {
        const textarea = document.getElementById("template-content");
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = formData.content;
        const before = text.substring(0, start);
        const selected = text.substring(start, end);
        const after = text.substring(end);

        const newContent = `${before}${symbol}${selected}${symbol}${after}`;
        setFormData({ ...formData, content: newContent });

        // Focus back
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + 1, end + 1);
        }, 10);
    };

    const formatPreview = (text) => {
        if (!text) return "";
        let formatted = text
            .replace(
                /\{\{name\}\}/g,
                '<span class="text-emerald-400 font-bold">John Doe</span>',
            )
            .replace(
                /\{\{phone\}\}/g,
                '<span class="text-emerald-400 font-bold">+1234567890</span>',
            )
            .replace(/\*(.*?)\*/g, "<strong>$1</strong>")
            .replace(/_(.*?)_/g, "<em>$1</em>")
            .replace(/~(.*?)~/g, "<del>$1</del>");

        return formatted;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
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
                        className="glass-card w-full max-w-5xl rounded-3xl overflow-hidden relative z-10 shadow-3xl border border-white/10"
                    >
                        {/* Header */}
                        <div className="p-6 h-20 flex items-center justify-between border-b border-white/5 bg-white/5">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                    <MessageCircle className="w-5 h-5 text-emerald-400" />
                                </div>
                                <h2 className="text-xl font-bold text-white tracking-tight">
                                    {initialData
                                        ? "Refine Template"
                                        : "WhatsApp Template Designer"}
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/5 rounded-xl text-slate-400 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Layout */}
                        <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-white/5">
                            {/* Editor Side */}
                            <form
                                onSubmit={handleSubmit}
                                className="p-8 space-y-6 flex-1"
                            >
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300 ml-1">
                                            Template Name
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 rounded-xl glass-input outline-none"
                                            placeholder="E.g. Promotional Welcome"
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
                                        <div className="flex items-center justify-between mb-2 px-1">
                                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                                <FileText className="w-3.5 h-3.5" />
                                                Template Content
                                            </label>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        applyFormatting("*")
                                                    }
                                                    className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 transition-colors"
                                                    title="Bold"
                                                >
                                                    <Bold className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        applyFormatting("_")
                                                    }
                                                    className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 transition-colors"
                                                    title="Italic"
                                                >
                                                    <Italic className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        applyFormatting("~")
                                                    }
                                                    className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 transition-colors"
                                                    title="Strikethrough"
                                                >
                                                    <Strikethrough className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                        <textarea
                                            id="template-content"
                                            rows={10}
                                            required
                                            className="w-full px-4 py-4 rounded-2xl glass-input outline-none resize-none font-sans leading-relaxed"
                                            placeholder="Hello {{name}}, we have a special offer for you!"
                                            value={formData.content}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    content: e.target.value,
                                                })
                                            }
                                        />
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        insertVariable("name")
                                                    }
                                                    className="px-3 py-1.5 rounded-lg bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 text-[10px] font-bold text-emerald-400 uppercase tracking-widest transition-all"
                                                >
                                                    + Name Placeholder
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        insertVariable("phone")
                                                    }
                                                    className="px-3 py-1.5 rounded-lg bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 text-[10px] font-bold text-emerald-400 uppercase tracking-widest transition-all"
                                                >
                                                    + Phone Placeholder
                                                </button>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-loose">
                                                {formData.content.length} chars
                                            </span>
                                        </div>
                                    </div>
                                </div>

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
                                                    ? "Save Changes"
                                                    : "Create Template"}
                                                <CheckCircle2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </form>

                            {/* Preview Side */}
                            <div className="bg-slate-900/40 p-12 flex items-center justify-center relative overflow-hidden hidden lg:flex w-[400px]">
                                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]" />

                                {/* Phone Frame */}
                                <div className="relative w-[300px] h-[550px] bg-slate-950 rounded-[40px] border-[8px] border-slate-800 shadow-2xl flex flex-col overflow-hidden">
                                    {/* Notch */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-20" />

                                    {/* WA Header */}
                                    <div className="bg-[#075e54] p-6 pt-10 flex items-center gap-3 shrink-0">
                                        <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center">
                                            <User className="w-5 h-5 text-slate-600" />
                                        </div>
                                        <div>
                                            <p className="text-white text-xs font-bold">
                                                Marketing Team
                                            </p>
                                            <p className="text-[10px] text-emerald-100">
                                                online
                                            </p>
                                        </div>
                                    </div>

                                    {/* Chat Body */}
                                    <div className="flex-1 bg-[#e5ddd5] p-4 space-y-4 relative overflow-y-auto custom-scrollbar">
                                        <div className="absolute inset-0 opacity-5 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat" />

                                        <div className="relative">
                                            <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-sm max-w-[85%] relative border border-black/5">
                                                <div className="absolute -left-2 top-0 w-0 h-0 border-t-[8px] border-t-white border-l-[8px] border-l-transparent" />
                                                <div
                                                    className="text-[13px] text-slate-800 whitespace-pre-wrap break-words leading-snug"
                                                    dangerouslySetInnerHTML={{
                                                        __html:
                                                            formatPreview(
                                                                formData.content,
                                                            ) ||
                                                            '<span class="text-slate-400 italic">No content yet...</span>',
                                                    }}
                                                />
                                                <div className="flex items-center justify-end gap-1 mt-1">
                                                    <span className="text-[9px] text-slate-400">
                                                        12:00 PM
                                                    </span>
                                                    <Check className="w-3 h-3 text-blue-400" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* WA Input Footer */}
                                    <div className="bg-[#f0f2f5] p-3 flex items-center gap-2 shrink-0">
                                        <div className="flex-1 h-9 bg-white rounded-full px-4 flex items-center">
                                            <span className="text-slate-400 text-[13px]">
                                                Message
                                            </span>
                                        </div>
                                        <div className="w-9 h-9 rounded-full bg-[#128c7e] flex items-center justify-center">
                                            <Smartphone className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20 backdrop-blur-md">
                                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                                        Pixel-Perfect Preview
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
