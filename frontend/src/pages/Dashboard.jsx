import React, { useEffect, useState } from 'react';
import { Mail, Users, Send, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../lib/axios';

export default function Dashboard() {
    const [stats, setStats] = useState({
        campaigns: 0,
        subscribers: 0,
        sent: 0,
        rate: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [campaignsRes, subscribersRes] = await Promise.all([
                    api.get('/campaigns'),
                    api.get('/subscribers'),
                ]);

                setStats({
                    campaigns: campaignsRes.data.Result?.total || 0,
                    subscribers: subscribersRes.data.Result?.total || 0,
                    sent: 0,
                    rate: 0,
                });
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        { title: 'Total Campaigns', value: stats.campaigns, icon: Mail, color: 'bg-blue-500', gradient: 'from-blue-500 to-cyan-500' },
        { title: 'Total Subscribers', value: stats.subscribers, icon: Users, color: 'bg-green-500', gradient: 'from-green-500 to-emerald-500' },
        { title: 'Emails Sent', value: stats.sent, icon: Send, color: 'bg-purple-500', gradient: 'from-purple-500 to-pink-500' },
        { title: 'Open Rate', value: `${stats.rate}%`, icon: TrendingUp, color: 'bg-orange-500', gradient: 'from-orange-500 to-red-500' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    return (
        <div>
            {/* Hero Section with Image */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative mb-8 rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8"
            >
                <div className="relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-4xl font-bold text-white mb-2"
                    >
                        Welcome to EmailApp
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="text-indigo-100 text-lg"
                    >
                        Manage your email campaigns with ease
                    </motion.p>
                </div>
                <div className="absolute top-0 right-0 w-1/3 h-full opacity-20">
                    <img
                        src="/home/awais/.gemini/antigravity/brain/6abb4a04-ef5b-4073-957b-ac0275de066b/email_marketing_hero_1764013321757.png"
                        alt="Email Marketing"
                        className="w-full h-full object-cover"
                    />
                </div>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
                {statCards.map((stat, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                        whileHover={{
                            scale: 1.05,
                            transition: { type: "spring", stiffness: 300 }
                        }}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-xl transition-shadow cursor-pointer relative overflow-hidden group"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                        <div className="relative flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                <motion.p
                                    initial={{ scale: 0.5 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                                    className="text-3xl font-bold text-gray-900 mt-2"
                                >
                                    {stat.value}
                                </motion.p>
                            </div>
                            <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6 }}
                                className={`bg-gradient-to-br ${stat.gradient} p-3 rounded-lg shadow-lg`}
                            >
                                <stat.icon className="w-6 h-6 text-white" />
                            </motion.div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <p className="text-gray-500">No recent activity to display.</p>
            </motion.div>
        </div>
    );
}
