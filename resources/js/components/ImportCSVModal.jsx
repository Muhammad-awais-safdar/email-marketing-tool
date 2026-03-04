import React, { useState, useEffect } from "react";
import {
    X,
    Upload,
    FileText,
    CheckCircle2,
    AlertCircle,
    Sparkles,
    ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../lib/axios";

export default function ImportCSVModal({ isOpen, onClose, onSuccess }) {
    const [file, setFile] = useState(null);
    const [emailListId, setEmailListId] = useState("");
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

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

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === "text/csv") {
            setFile(selectedFile);
        } else {
            alert("Please select a valid CSV file");
            e.target.value = "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !emailListId) return;

        setLoading(true);
        try {
            const text = await file.text();
            const rows = text
                .split("\n")
                .filter((r) => r.trim())
                .slice(1); // Skip header

            let successCount = 0;
            for (const row of rows) {
                const [email, name] = row.split(",").map((s) => s.trim());
                if (email) {
                    try {
                        await api.post("/subscribers", {
                            email,
                            name: name || "",
                            email_list_id: emailListId,
                        });
                        successCount++;
                    } catch (err) {
                        console.error(`Failed to import ${email}:`, err);
                    }
                }
            }

            onSuccess();
            onClose();
            setFile(null);
            setEmailListId("");
        } catch (error) {
            console.error("Failed to import CSV");
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
                        className="glass-card w-full max-w-md rounded-3xl overflow-hidden relative z-10 shadow-2xl border-white/10"
                    >
                        {/* Header */}
                        <div className="p-6 h-20 flex items-center justify-between border-b border-white/5 bg-white/5">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                    <Upload className="w-5 h-5 text-indigo-400" />
                                </div>
                                <h2 className="text-xl font-bold text-white tracking-tight">
                                    Bulk Import
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
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 ml-1">
                                    Target List
                                </label>
                                <div className="relative group">
                                    <select
                                        required
                                        className="w-full px-4 py-3 rounded-xl glass-input outline-none appearance-none cursor-pointer"
                                        value={emailListId}
                                        onChange={(e) =>
                                            setEmailListId(e.target.value)
                                        }
                                    >
                                        <option
                                            value=""
                                            className="bg-slate-900"
                                        >
                                            Select destination list
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
                                <label className="text-sm font-medium text-slate-300 ml-1">
                                    Select CSV File
                                </label>
                                <div
                                    className={`relative rounded-2xl border-2 border-dashed transition-all p-8 flex flex-col items-center justify-center gap-4 ${
                                        isDragging
                                            ? "border-indigo-500 bg-indigo-500/5"
                                            : "border-white/10 hover:border-white/20"
                                    } ${file ? "bg-indigo-500/5 border-indigo-500/30" : ""}`}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setIsDragging(true);
                                    }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        setIsDragging(false);
                                        const f = e.dataTransfer.files[0];
                                        if (f?.type === "text/csv") setFile(f);
                                    }}
                                >
                                    <input
                                        type="file"
                                        accept=".csv"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={handleFileChange}
                                    />
                                    {file ? (
                                        <div className="text-center">
                                            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mx-auto mb-3">
                                                <FileText className="w-6 h-6 text-indigo-400" />
                                            </div>
                                            <p className="text-sm font-bold text-white max-w-[200px] truncate">
                                                {file.name}
                                            </p>
                                            <p className="text-xs text-indigo-400/60 mt-1 uppercase tracking-widest">
                                                Ready to upload
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="text-center group-hover:scale-105 transition-transform duration-300">
                                            <Upload className="mx-auto h-10 w-10 text-slate-600 mb-2 transition-colors group-hover:text-indigo-400" />
                                            <p className="text-sm font-medium text-slate-300">
                                                Drop your file here
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1 italic">
                                                Expects columns: email, name
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    <strong className="text-indigo-300">
                                        Tip:
                                    </strong>{" "}
                                    Ensure your first row contains headers.
                                    Duplicate emails will be skipped
                                    automatically.{" "}
                                    <a
                                        href="/subscribers_demo.csv"
                                        download
                                        className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 font-bold ml-1"
                                    >
                                        Download Demo CSV
                                    </a>
                                </p>
                            </div>

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
                                    disabled={loading || !file || !emailListId}
                                    className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition-all flex items-center gap-2 group"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Import Now
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
