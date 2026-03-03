import React, { useState } from 'react';
import { Save, Mail } from 'lucide-react';

export default function Settings() {
    const [formData, setFormData] = useState({
        mail_driver: 'smtp',
        mail_host: '',
        mail_port: '587',
        mail_username: '',
        mail_password: '',
        mail_encryption: 'tls',
        mail_from_address: '',
        mail_from_name: '',
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        // In a real implementation, this would save to backend
        // For now, we'll just simulate saving to localStorage
        try {
            localStorage.setItem('email_settings', JSON.stringify(formData));
            alert('Email settings saved successfully!');
        } catch (error) {
            alert('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    React.useEffect(() => {
        // Load saved settings
        const saved = localStorage.getItem('email_settings');
        if (saved) {
            setFormData(JSON.parse(saved));
        }
    }, []);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Email Configuration</h1>
                <p className="text-gray-600 mt-2">Configure your SMTP settings for sending emails</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mail Driver</label>
                            <select
                                value={formData.mail_driver}
                                onChange={(e) => setFormData({ ...formData, mail_driver: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="smtp">SMTP</option>
                                <option value="sendmail">Sendmail</option>
                                <option value="mailgun">Mailgun</option>
                                <option value="ses">Amazon SES</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
                            <input
                                type="text"
                                value={formData.mail_host}
                                onChange={(e) => setFormData({ ...formData, mail_host: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="smtp.gmail.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
                            <input
                                type="number"
                                value={formData.mail_port}
                                onChange={(e) => setFormData({ ...formData, mail_port: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="587"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Encryption</label>
                            <select
                                value={formData.mail_encryption}
                                onChange={(e) => setFormData({ ...formData, mail_encryption: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="tls">TLS</option>
                                <option value="ssl">SSL</option>
                                <option value="">None</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                            <input
                                type="text"
                                value={formData.mail_username}
                                onChange={(e) => setFormData({ ...formData, mail_username: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="your-email@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                value={formData.mail_password}
                                onChange={(e) => setFormData({ ...formData, mail_password: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">From Email</label>
                            <input
                                type="email"
                                value={formData.mail_from_address}
                                onChange={(e) => setFormData({ ...formData, mail_from_address: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="noreply@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">From Name</label>
                            <input
                                type="text"
                                value={formData.mail_from_name}
                                onChange={(e) => setFormData({ ...formData, mail_from_name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Your Company"
                            />
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-medium text-blue-900 mb-1">SMTP Configuration</h4>
                                <p className="text-sm text-blue-800">
                                    Make sure to use app-specific passwords for services like Gmail. Regular passwords may not work due to security restrictions.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                            <Save className="w-5 h-5" />
                            {saving ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
