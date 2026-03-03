import React, { useState, useEffect } from "react";
import {
    X,
    Save,
    Sparkles,
    Layout,
    Type,
    MousePointer2,
    Settings2,
    Trash2,
    Redo,
    Undo,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VisualTemplateEditor({ isOpen, onClose, onSave }) {
    const [templateData, setTemplateData] = useState({
        name: "My Custom Template",
        styles: {
            backgroundColor: "#0f172a",
            textColor: "#f8fafc",
            cardBackgroundColor: "#1e293b",
            borderRadius: "24",
            paddingX: "40",
            paddingY: "60",
            textAlign: "center",
            fontSize: "16",
            accentColor: "#6366f1",
        },
        content: {
            header: "Welcome to Our Newsletter",
            body: "Design your perfect email template visually and save it instantly. Change colors, spacing, and content to match your brand.",
            buttonText: "Get Started Now",
            footer: "© 2024 Your Brand. All rights reserved.",
        },
    });

    const [generatedHtml, setGeneratedHtml] = useState("");

    useEffect(() => {
        generateHtml();
    }, [templateData]);

    const generateHtml = () => {
        const { styles, content } = templateData;
        const html = `
            <div style="background-color: ${styles.backgroundColor}; padding: ${styles.paddingY}px 20px; font-family: sans-serif; min-height: 100%;">
                <div style="max-width: 600px; margin: 0 auto; background-color: ${styles.cardBackgroundColor}; border-radius: ${styles.borderRadius}px; padding: ${styles.paddingY}px ${styles.paddingX}px; color: ${styles.textColor}; text-align: ${styles.textAlign}; border: 1px solid rgba(255,255,255,0.05); shadow: 0 20px 50px rgba(0,0,0,0.3);">
                    <h1 style="color: ${styles.accentColor}; font-size: 28px; font-weight: 800; margin-bottom: 24px;">${content.header}</h1>
                    <p style="font-size: ${styles.fontSize}px; line-height: 1.6; color: ${styles.textColor}cc; margin-bottom: 32px;">${content.body}</p>
                    <a href="#" style="display: inline-block; background-color: ${styles.accentColor}; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 15px;">${content.buttonText}</a>
                    <div style="margin-top: 48px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 24px; font-size: 12px; color: ${styles.textColor}66;">
                        ${content.footer}
                    </div>
                </div>
            </div>
        `.trim();
        setGeneratedHtml(html);
    };

    const handleSave = () => {
        onSave({
            name: templateData.name,
            content: generatedHtml,
        });
        onClose();
    };

    const updateStyle = (key, value) => {
        setTemplateData((prev) => ({
            ...prev,
            styles: { ...prev.styles, [key]: value },
        }));
    };

    const updateContent = (key, value) => {
        setTemplateData((prev) => ({
            ...prev,
            content: { ...prev.content, [key]: value },
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-slate-950 overflow-hidden">
            {/* Toolbar */}
            <div className="h-20 bg-slate-900 border-b border-white/5 flex items-center justify-between px-8 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                        <Sparkles className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <input
                            value={templateData.name}
                            onChange={(e) =>
                                setTemplateData({
                                    ...templateData,
                                    name: e.target.value,
                                })
                            }
                            className="bg-transparent text-white font-bold text-lg outline-none border-b border-transparent focus:border-indigo-500/50 transition-all px-1"
                        />
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold ml-1 mt-0.5">
                            Visual Designer Alpha
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm font-semibold"
                    >
                        Discard
                    </button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSave}
                        className="px-8 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 group"
                    >
                        Save Template
                        <Save className="w-4 h-4" />
                    </motion.button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Control Sidebar */}
                <div className="w-80 border-r border-white/5 bg-slate-900/50 flex flex-col overflow-y-auto custom-scrollbar p-6 space-y-8">
                    {/* Style Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-indigo-400 font-bold text-[10px] uppercase tracking-widest">
                            <Settings2 className="w-3.5 h-3.5" />
                            Global Styles
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs text-slate-400 font-medium ml-1">
                                    Accent Highlight
                                </label>
                                <div className="flex gap-3">
                                    <input
                                        type="color"
                                        value={templateData.styles.accentColor}
                                        onChange={(e) =>
                                            updateStyle(
                                                "accentColor",
                                                e.target.value,
                                            )
                                        }
                                        className="h-10 w-full bg-transparent p-0 border-0 outline-none cursor-pointer rounded-lg overflow-hidden"
                                    />
                                    <div className="flex-1 py-2 px-3 rounded-lg bg-white/5 border border-white/10 text-[10px] items-center flex font-mono text-slate-400 uppercase">
                                        {templateData.styles.accentColor}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs text-slate-400 font-medium ml-1">
                                        Card Color
                                    </label>
                                    <input
                                        type="color"
                                        value={
                                            templateData.styles
                                                .cardBackgroundColor
                                        }
                                        onChange={(e) =>
                                            updateStyle(
                                                "cardBackgroundColor",
                                                e.target.value,
                                            )
                                        }
                                        className="h-10 w-full bg-transparent p-0 border-0 outline-none cursor-pointer rounded-lg overflow-hidden"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-slate-400 font-medium ml-1">
                                        Text Color
                                    </label>
                                    <input
                                        type="color"
                                        value={templateData.styles.textColor}
                                        onChange={(e) =>
                                            updateStyle(
                                                "textColor",
                                                e.target.value,
                                            )
                                        }
                                        className="h-10 w-full bg-transparent p-0 border-0 outline-none cursor-pointer rounded-lg overflow-hidden"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-slate-400 font-medium ml-1 flex justify-between">
                                    Border Radius
                                    <span className="text-indigo-400">
                                        {templateData.styles.borderRadius}px
                                    </span>
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="60"
                                    value={templateData.styles.borderRadius}
                                    onChange={(e) =>
                                        updateStyle(
                                            "borderRadius",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Spacing Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-indigo-400 font-bold text-[10px] uppercase tracking-widest">
                            <Layout className="w-3.5 h-3.5" />
                            Layout & Spacing
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs text-slate-400 font-medium ml-1">
                                    Padding X
                                </label>
                                <input
                                    type="number"
                                    value={templateData.styles.paddingX}
                                    onChange={(e) =>
                                        updateStyle("paddingX", e.target.value)
                                    }
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-indigo-500/50 transition-all font-mono"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-slate-400 font-medium ml-1">
                                    Padding Y
                                </label>
                                <input
                                    type="number"
                                    value={templateData.styles.paddingY}
                                    onChange={(e) =>
                                        updateStyle("paddingY", e.target.value)
                                    }
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-indigo-500/50 transition-all font-mono"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-indigo-400 font-bold text-[10px] uppercase tracking-widest">
                            <Type className="w-3.5 h-3.5" />
                            Text Content
                        </div>
                        <div className="space-y-4 font-sans">
                            <div className="space-y-2">
                                <label className="text-xs text-slate-500 ml-1">
                                    Header Title
                                </label>
                                <input
                                    type="text"
                                    value={templateData.content.header}
                                    onChange={(e) =>
                                        updateContent("header", e.target.value)
                                    }
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-indigo-500/50 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-slate-500 ml-1">
                                    Body Message
                                </label>
                                <textarea
                                    rows={4}
                                    value={templateData.content.body}
                                    onChange={(e) =>
                                        updateContent("body", e.target.value)
                                    }
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-indigo-500/50 transition-all resize-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-slate-500 ml-1">
                                    Action Button
                                </label>
                                <input
                                    type="text"
                                    value={templateData.content.buttonText}
                                    onChange={(e) =>
                                        updateContent(
                                            "buttonText",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-indigo-500/50 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview Canvas */}
                <div className="flex-1 bg-slate-950 p-12 overflow-y-auto custom-scrollbar flex items-start justify-center">
                    <motion.div
                        layout
                        className="w-full max-w-[600px] bg-slate-900 rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-600/5 pointer-events-none" />

                        {/* Device Indicator */}
                        <div className="h-10 flex items-center justify-center gap-6 border-b border-white/5 bg-white/5">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Layout className="w-3 h-3" />
                                Email Preview Container
                            </span>
                        </div>

                        {/* Actual Renderized HTML in an Iframe for isolation */}
                        <iframe
                            srcDoc={generatedHtml}
                            className="w-full h-[600px] border-none"
                            title="preview"
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
