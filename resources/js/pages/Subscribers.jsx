import React, { useEffect, useState } from "react";
import {
    Plus,
    Edit,
    Trash2,
    UserPlus,
    Users,
    Upload,
    Search,
    Filter,
    ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../lib/axios";
import CreateSubscriberModal from "../components/CreateSubscriberModal";
import ImportCSVModal from "../components/ImportCSVModal";

export default function Subscribers() {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const fetchSubscribers = async () => {
        try {
            setLoading(true);
            const response = await api.get("/subscribers");
            setSubscribers(response.data.Result?.data || []);
        } catch (error) {
            console.error("Failed to fetch subscribers:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (subscriberId) => {
        if (!confirm("Are you sure you want to delete this subscriber?"))
            return;
        try {
            await api.delete(`/subscribers/${subscriberId}`);
            fetchSubscribers();
        } catch (error) {
            console.error("Failed to delete subscriber");
        }
    };

    const filteredSubscribers = subscribers.filter(
        (s) =>
            s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (s.name &&
                s.name.toLowerCase().includes(searchQuery.toLowerCase())),
    );

    return (
        <div className="space-y-8">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <UserPlus className="w-8 h-8 text-indigo-400" />
                        Subscribers
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Total audience: {subscribers.length} contacts
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowImportModal(true)}
                        className="glass-button flex items-center gap-2"
                    >
                        <Upload className="w-4 h-4" />
                        <span>Import CSV</span>
                    </button>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 group"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                        Add Contact
                    </button>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search subscribers by name or email..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl glass-input outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className="glass-button flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Status
                </button>
            </div>

            {loading ? (
                <div className="glass-card rounded-2xl overflow-hidden animate-pulse">
                    <div className="h-12 bg-white/5 border-b border-white/5" />
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div
                            key={i}
                            className="h-16 bg-white/5 border-b border-white/5 mx-6"
                        />
                    ))}
                </div>
            ) : filteredSubscribers.length === 0 ? (
                <div className="glass-card p-16 text-center rounded-3xl">
                    <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-6">
                        <Users className="w-10 h-10 text-slate-600" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                        No subscribers yet
                    </h3>
                    <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                        Start building your community by importing contacts or
                        adding them manually.
                    </p>
                </div>
            ) : (
                <div className="glass-card rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="glass-table">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10 text-left">
                                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        Contact
                                    </th>
                                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        Status
                                    </th>
                                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        Email List
                                    </th>
                                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <AnimatePresence>
                                    {filteredSubscribers.map((subscriber) => (
                                        <motion.tr
                                            key={subscriber.id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="glass-table-row group"
                                        >
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-sm font-bold text-slate-300 border border-white/5 group-hover:border-indigo-500/30 transition-colors">
                                                        {subscriber.name
                                                            ? subscriber.name
                                                                  .charAt(0)
                                                                  .toUpperCase()
                                                            : subscriber.email
                                                                  .charAt(0)
                                                                  .toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white transition-colors group-hover:text-indigo-300">
                                                            {subscriber.name ||
                                                                "Anonymous contact"}
                                                        </p>
                                                        <p className="text-sm text-slate-500">
                                                            {subscriber.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-tight ${
                                                        subscriber.status ===
                                                        "active"
                                                            ? "bg-emerald-500/10 text-emerald-400"
                                                            : "bg-slate-500/10 text-slate-400"
                                                    }`}
                                                >
                                                    <ShieldCheck className="w-3.5 h-3.5" />
                                                    {subscriber.status}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="text-sm text-slate-400 italic">
                                                    {subscriber.email_list
                                                        ?.name || "Unassigned"}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-indigo-400 transition-all">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                subscriber.id,
                                                            )
                                                        }
                                                        className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-red-400 transition-all"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <CreateSubscriberModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={fetchSubscribers}
            />

            <ImportCSVModal
                isOpen={showImportModal}
                onClose={() => setShowImportModal(false)}
                onSuccess={fetchSubscribers}
            />
        </div>
    );
}
