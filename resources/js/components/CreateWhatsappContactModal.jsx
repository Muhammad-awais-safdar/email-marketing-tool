import React, { useState, useEffect } from "react";
import {
    X,
    UserPlus,
    Phone,
    User,
    ChevronDown,
    CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../lib/axios";
import { useToast } from "../context/ToastContext";

export default function CreateWhatsappContactModal({
    isOpen,
    onClose,
    onSuccess,
    initialData = null,
}) {
    const [formData, setFormData] = useState({
        phone_number: "",
        name: "",
        whatsapp_list_id: "",
    });
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    useEffect(() => {
        if (isOpen) {
            fetchLists();
            if (initialData) {
                setFormData({
                    phone_number: initialData.phone_number,
                    name: initialData.name || "",
                    whatsapp_list_id: initialData.whatsapp_list_id,
                });
            } else {
                setFormData({
                    phone_number: "",
                    name: "",
                    whatsapp_list_id: "",
                });
            }
        }
    }, [isOpen, initialData]);

    const fetchLists = async () => {
        try {
            const response = await api.get("/v1/whatsapp-lists");
            setLists(response.data.Result || []);
        } catch (error) {
            toast.error("Failed to load WhatsApp lists.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (initialData?.id) {
                await api.put(
                    `/v1/whatsapp-contacts/${initialData.id}`,
                    formData,
                );
                toast.success("Contact updated successfully!");
            } else {
                await api.post("/v1/whatsapp-contacts", formData);
                toast.success("Contact added successfully!");
            }
            onSuccess();
            onClose();
        } catch (error) {
            toast.error("Failed to save contact. Please check the input.");
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
                        className="glass-card w-full max-w-md rounded-3xl overflow-hidden relative z-10 shadow-2xl border border-white/10"
                    >
                        {/* Header */}
                        <div className="p-6 h-20 flex items-center justify-between border-b border-white/5 bg-white/5">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                    <UserPlus className="w-5 h-5 text-emerald-400" />
                                </div>
                                <h2 className="text-xl font-bold text-white tracking-tight">
                                    {initialData
                                        ? "Edit Contact"
                                        : "Add WhatsApp Contact"}
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
                                <label className="text-sm font-medium text-slate-300 ml-1 flex items-center gap-2">
                                    <Phone className="w-3.5 h-3.5" />
                                    Phone Number
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl glass-input outline-none font-mono"
                                    placeholder="+1234567890"
                                    value={formData.phone_number}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            phone_number: e.target.value,
                                        })
                                    }
                                />
                                <p className="text-[10px] text-slate-500 ml-1 italic">
                                    Include country code (e.g., +1 for US)
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 ml-1 flex items-center gap-2">
                                    <User className="w-3.5 h-3.5" />
                                    Full Name (Optional)
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl glass-input outline-none"
                                    placeholder="John Doe"
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
                                <label className="text-sm font-medium text-slate-300 ml-1">
                                    WhatsApp List
                                </label>
                                <div className="relative group">
                                    <select
                                        required
                                        className="w-full px-4 py-3 rounded-xl glass-input outline-none appearance-none cursor-pointer"
                                        value={formData.whatsapp_list_id}
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
                                                {list.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none group-focus-within:text-emerald-400 transition-colors" />
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
                                    className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/20 disabled:opacity-50 transition-all flex items-center gap-2 group"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            {initialData
                                                ? "Update"
                                                : "Add Contact"}
                                            <CheckCircle2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
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
