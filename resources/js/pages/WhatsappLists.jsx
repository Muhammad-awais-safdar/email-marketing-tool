import React, { useEffect, useState } from "react";
import {
    Plus,
    Edit,
    Trash2,
    Users,
    List,
    Sparkles,
    X,
    ChevronRight,
    Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../lib/axios";
import { useToast } from "../context/ToastContext";

export default function WhatsappLists() {
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingList, setEditingList] = useState(null);
    const [formData, setFormData] = useState({ name: "", description: "" });
    const toast = useToast();

    useEffect(() => {
        fetchLists();
    }, []);

    const fetchLists = async () => {
        try {
            setLoading(true);
            const response = await api.get("/v1/whatsapp-lists");
            setLists(response.data.Result || []);
        } catch (error) {
            toast.error("Failed to fetch WhatsApp lists");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (list = null) => {
        if (list) {
            setEditingList(list);
            setFormData({
                name: list.name,
                description: list.description || "",
            });
        } else {
            setEditingList(null);
            setFormData({ name: "", description: "" });
        }
        setShowCreateModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingList) {
                await api.put(`/v1/whatsapp-lists/${editingList.id}`, formData);
                toast.success("WhatsApp list updated!");
            } else {
                await api.post("/v1/whatsapp-lists", formData);
                toast.success("WhatsApp list created!");
            }
            fetchLists();
            setShowCreateModal(false);
        } catch (error) {
            toast.error(
                editingList ? "Failed to update list" : "Failed to create list",
            );
        }
    };

    const handleDelete = async (listId) => {
        if (
            !confirm(
                "Are you sure? All contacts in this list will also be deleted.",
            )
        )
            return;
        try {
            await api.delete(`/v1/whatsapp-lists/${listId}`);
            toast.success("List deleted successfully");
            fetchLists();
        } catch (error) {
            toast.error("Failed to delete list. It might be in use.");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <List className="w-8 h-8 text-emerald-400" />
                        WhatsApp Lists
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Organize your WhatsApp contacts into segments
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    New List
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="glass-card p-6 h-40 animate-pulse rounded-2xl bg-white/5"
                        />
                    ))}
                </div>
            ) : lists.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-16 text-center rounded-3xl border border-white/5"
                >
                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                        <Users className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                        Start your first WhatsApp list
                    </h3>
                    <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                        Group your contacts for targeted WhatsApp campaigns and
                        better engagement.
                    </p>
                    <button
                        onClick={() => handleOpenModal()}
                        className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold transition-all"
                    >
                        Create List
                    </button>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {lists.map((list) => (
                            <motion.div
                                key={list.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="glass-card p-6 rounded-2xl group flex flex-col h-full relative overflow-hidden border border-white/5"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                    <button
                                        onClick={() => handleOpenModal(list)}
                                        className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-emerald-400 transition-all"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(list.id)}
                                        className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-red-400 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 flex items-center justify-center border border-emerald-500/20">
                                        <Users className="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors uppercase tracking-tight line-clamp-1">
                                            {list.name}
                                        </h3>
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mt-0.5">
                                            <Sparkles className="w-3 h-3 text-emerald-400/50" />
                                            <span>
                                                {list.contacts_count || 0}{" "}
                                                Contacts
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {list.description && (
                                    <p className="text-sm text-slate-400 leading-relaxed mb-6 line-clamp-2 italic">
                                        "{list.description}"
                                    </p>
                                )}

                                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                    <span>WhatsApp Segment</span>
                                    <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-emerald-500 transition-colors" />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Modal */}
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
                            className="glass-card w-full max-w-md rounded-3xl overflow-hidden relative z-10 shadow-2xl border border-white/10"
                        >
                            <div className="p-6 h-20 flex items-center justify-between border-b border-white/5 bg-white/5">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                        {editingList ? (
                                            <Edit className="w-5 h-5 text-emerald-400" />
                                        ) : (
                                            <Plus className="w-5 h-5 text-emerald-400" />
                                        )}
                                    </div>
                                    <h2 className="text-xl font-bold text-white tracking-tight">
                                        {editingList
                                            ? "Edit WhatsApp List"
                                            : "Create WhatsApp List"}
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
                                        List Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-xl glass-input outline-none"
                                        placeholder="E.g. VIP Customers"
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
                                        <Info className="w-3.5 h-3.5 text-slate-500" />
                                        Description (Optional)
                                    </label>
                                    <textarea
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl glass-input outline-none resize-none"
                                        placeholder="What's this list for?"
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                description: e.target.value,
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
                                        className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 group"
                                    >
                                        {editingList ? "Update" : "Create"}
                                        <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
