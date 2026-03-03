import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, UserPlus, Upload } from 'lucide-react';
import api from '../lib/axios';
import CreateSubscriberModal from '../components/CreateSubscriberModal';
import ImportCSVModal from '../components/ImportCSVModal';

export default function Subscribers() {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const fetchSubscribers = async () => {
        try {
            const response = await api.get('/subscribers');
            setSubscribers(response.data.Result?.data || []);
        } catch (error) {
            console.error('Failed to fetch subscribers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (subscriberId) => {
        if (!confirm('Are you sure you want to delete this subscriber?')) return;

        try {
            await api.delete(`/subscribers/${subscriberId}`);
            fetchSubscribers();
        } catch (error) {
            alert('Failed to delete subscriber');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Subscribers</h1>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowImportModal(true)}
                        className="flex items-center gap-2 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                    >
                        <Upload className="w-5 h-5" />
                        Import CSV
                    </button>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Add Subscriber
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">Loading subscribers...</p>
                </div>
            ) : subscribers.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No subscribers yet</h3>
                    <p className="text-gray-500 mb-6">Add your first subscriber to start building your list.</p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => setShowImportModal(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                        >
                            <Upload className="w-5 h-5" />
                            Import CSV
                        </button>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Add Subscriber
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">List</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {subscribers.map((subscriber) => (
                                <tr key={subscriber.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {subscriber.name || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {subscriber.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${subscriber.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {subscriber.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {subscriber.email_list?.name || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(subscriber.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
