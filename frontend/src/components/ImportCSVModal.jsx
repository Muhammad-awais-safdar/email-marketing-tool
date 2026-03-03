import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import api from '../lib/axios';

export default function ImportCSVModal({ isOpen, onClose, onSuccess }) {
    const [file, setFile] = useState(null);
    const [emailListId, setEmailListId] = useState('');
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        if (isOpen) {
            fetchLists();
        }
    }, [isOpen]);

    const fetchLists = async () => {
        try {
            const response = await api.get('/email-lists');
            setLists(response.data.Result || []);
        } catch (error) {
            console.error('Failed to fetch lists:', error);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'text/csv') {
            setFile(selectedFile);
        } else {
            alert('Please select a valid CSV file');
            e.target.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !emailListId) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('email_list_id', emailListId);

        try {
            // Parse CSV and create subscribers
            const text = await file.text();
            const rows = text.split('\n').slice(1); // Skip header

            let successCount = 0;
            for (const row of rows) {
                const [email, name] = row.split(',').map(s => s.trim());
                if (email) {
                    try {
                        await api.post('/subscribers', {
                            email,
                            name: name || '',
                            email_list_id: emailListId,
                        });
                        successCount++;
                    } catch (err) {
                        console.error(`Failed to import ${email}:`, err);
                    }
                }
            }

            alert(`Successfully imported ${successCount} subscribers`);
            onSuccess();
            onClose();
            setFile(null);
            setEmailListId('');
        } catch (error) {
            alert('Failed to import CSV');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full m-4">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Import CSV</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email List</label>
                        <select
                            required
                            value={emailListId}
                            onChange={(e) => setEmailListId(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Select a list</option>
                            {lists.map((list) => (
                                <option key={list.id} value={list.id}>
                                    {list.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CSV File</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-400 transition-colors">
                            <div className="space-y-1 text-center">
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                                        <span>Upload a file</span>
                                        <input
                                            type="file"
                                            accept=".csv"
                                            required
                                            onChange={handleFileChange}
                                            className="sr-only"
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">CSV file with email,name columns</p>
                                {file && <p className="text-sm text-green-600 mt-2">✓ {file.name}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                            <strong>CSV Format:</strong> First row should be headers (email,name). Each subsequent row should contain subscriber data.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading || !file || !emailListId}
                            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Importing...' : 'Import Subscribers'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
