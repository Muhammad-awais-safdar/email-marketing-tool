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
    Phone,
    CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../lib/axios";
import { useToast } from "../context/ToastContext";
import CreateWhatsappContactModal from "../components/CreateWhatsappContactModal";
import ImportWhatsappCSVModal from "../components/ImportWhatsappCSVModal";

export default function WhatsappContacts() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const toast = useToast();

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const response = await api.get("/v1/whatsapp-contacts");
            setContacts(response.data.Result?.data || []);
        } catch (error) {
            toast.error("Failed to fetch WhatsApp contacts");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (contact) => {
        setSelectedContact(contact);
        setShowCreateModal(true);
    };

    const handleDelete = async (contactId) => {
        if (!confirm("Are you sure you want to delete this contact?")) return;
        try {
            await api.delete(`/v1/whatsapp-contacts/${contactId}`);
            toast.success("Contact deleted successfully");
            fetchContacts();
        } catch (error) {
            toast.error("Failed to delete contact");
        }
    };

    const filteredContacts = contacts.filter(
        (c) =>
            c.phone_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (c.name &&
                c.name.toLowerCase().includes(searchQuery.toLowerCase())),
    );

    return (
        <div className="space-y-8">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <UserPlus className="w-8 h-8 text-emerald-400" />
                        WhatsApp Contacts
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Total reach: {contacts.length} mobile numbers
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
                        onClick={() => {
                            setSelectedContact(null);
                            setShowCreateModal(true);
                        }}
                        className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 group"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                        Add Contact
                    </button>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search contacts by name or phone..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl glass-input outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
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
            ) : filteredContacts.length === 0 ? (
                <div className="glass-card p-16 text-center rounded-3xl border border-white/5">
                    <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-6">
                        <Users className="w-10 h-10 text-slate-600" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                        No WhatsApp contacts yet
                    </h3>
                    <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                        Grow your WhatsApp audience by importing contacts or
                        adding them manually.
                    </p>
                </div>
            ) : (
                <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
                    <div className="overflow-x-auto">
                        <table className="glass-table">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10 text-left">
                                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        Contact
                                    </th>
                                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        WhatsApp List
                                    </th>
                                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <AnimatePresence>
                                    {filteredContacts.map((contact) => (
                                        <motion.tr
                                            key={contact.id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="glass-table-row group"
                                        >
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-900/40 to-emerald-800/20 flex items-center justify-center text-sm font-bold text-emerald-400 border border-emerald-500/10 group-hover:border-emerald-500/30 transition-colors">
                                                        <Phone className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white transition-colors group-hover:text-emerald-300">
                                                            {contact.name ||
                                                                "Anonymous"}
                                                        </p>
                                                        <p className="text-sm text-emerald-400/60 font-mono">
                                                            {
                                                                contact.phone_number
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="text-sm text-slate-400 italic">
                                                    {contact.whatsapp_list
                                                        ?.name || "Unassigned"}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() =>
                                                            handleEdit(contact)
                                                        }
                                                        className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-emerald-400 transition-all"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                contact.id,
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

            <CreateWhatsappContactModal
                isOpen={showCreateModal}
                onClose={() => {
                    setShowCreateModal(false);
                    setSelectedContact(null);
                }}
                onSuccess={fetchContacts}
                initialData={selectedContact}
            />

            <ImportWhatsappCSVModal
                isOpen={showImportModal}
                onClose={() => setShowImportModal(false)}
                onSuccess={fetchContacts}
            />
        </div>
    );
}
