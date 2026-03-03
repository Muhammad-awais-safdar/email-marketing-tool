import React, { useEffect, useState } from 'react';
import { Plus, Send, Edit, Trash2, Mail } from 'lucide-react';
import api from '../lib/axios';
import CreateCampaignModal from '../components/CreateCampaignModal';

export default function Campaigns() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const response = await api.get('/campaigns');
            setCampaigns(response.data.Result?.data || []);
        } catch (error) {
            console.error('Failed to fetch campaigns:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (campaignId) => {
        try {
            await api.post(`/campaigns/${campaignId}/send`);
            alert('Campaign queued for sending!');
            fetchCampaigns();
        } catch (error) {
            alert('Failed to send campaign');
        }
    };

    const handleDelete = async (campaignId) => {
        if (!confirm('Are you sure you want to delete this campaign?')) return;

        try {
            await api.delete(`/campaigns/${campaignId}`);
            fetchCampaigns();
        } catch (error) {
            alert('Failed to delete campaign');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    New Campaign
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">Loading campaigns...</p>
                </div>
            ) : campaigns.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No campaigns yet</h3>
                    <p className="text-gray-500 mb-6">Create your first email campaign to get started.</p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Create Campaign
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {campaigns.map((campaign) => (
                        <div key={campaign.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{campaign.name}</h3>
                                    <p className="text-sm text-gray-600 mb-1">Subject: {campaign.subject}</p>
                                    <div className="flex items-center gap-4 mt-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${campaign.status === 'sent' ? 'bg-green-100 text-green-800' :
                                                campaign.status === 'sending' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {campaign.status}
                                        </span>
                                        {campaign.scheduled_at && (
                                            <span className="text-xs text-gray-500">
                                                Scheduled: {new Date(campaign.scheduled_at).toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {campaign.status === 'draft' && (
                                        <button
                                            onClick={() => handleSend(campaign.id)}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            title="Send Campaign"
                                        >
                                            <Send className="w-5 h-5" />
                                        </button>
                                    )}
                                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(campaign.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <CreateCampaignModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={fetchCampaigns}
            />
        </div>
    );
}
