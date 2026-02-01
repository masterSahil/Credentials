import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Menu from '../Menu/Menu';
import { AiOutlineCheckCircle, AiOutlineWarning } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';
import { FaArrowLeft, FaLink, FaGlobe, FaSave } from 'react-icons/fa';

const EditLink = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const URL = `${import.meta.env.VITE_API_KEY}/link`;

    const [formData, setFormData] = useState({
        plateform: '',
        link: ''
    });

    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [messageType, setMessageType] = useState('');
    const [message, setMessage] = useState(false);
    const [loading, setLoading] = useState(false);

    const triggerToast = (type, msg) => {
        setMessageType(type);
        type === "success" ? setSuccessMsg(msg) : setErrorMsg(msg);
        setMessage(true);
        setTimeout(() => setMessage(false), 3000);
    };

    const getData = async () => {
        try {
            setLoading(true);
            const res = await axios.get(URL);
            const linkData = res.data.link;
            const found = linkData.find(link => link._id === id);
            if (found) {
                setFormData({
                    plateform: found.plateform,
                    link: found.link
                });
            }
        } catch (error) {
            triggerToast("error", "Failed to retrieve link data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`${URL}/${id}`, formData);
            triggerToast("success", "Link updated successfully!");
            setTimeout(() => {
                navigate('/links');
            }, 2000);
        } catch (error) {
            triggerToast("error", error.message || "Update failed.");
        }
    };

    return (
        <div className="min-h-screen bg-[#06021b] flex font-sans selection:bg-indigo-500/30 overflow-x-hidden">
            {/* --- INLINE UI ANIMATIONS --- */}
            <style>
                {`
                    @keyframes slideIn { 0% { transform: translateX(100%); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
                    .animate-toast { animation: slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                    .shimmer-btn { position: relative; overflow: hidden; }
                    .shimmer-btn::after { content: ''; position: absolute; top: 0; left: -150%; width: 50%; height: 100%; background: rgba(255, 255, 255, 0.15); transform: skewX(-25deg); transition: 0.7s; }
                    .shimmer-btn:hover::after { left: 150%; }
                `}
            </style>

            {/* --- TOAST / LOADING NOTIFICATION --- */}
            {(message || loading) && (
                <div className={`fixed top-8 right-8 z-[100] flex items-center gap-5 px-8 py-6 rounded-xl shadow-2xl border backdrop-blur-3xl animate-toast ${
                    loading ? 'bg-indigo-500/15 border-indigo-500/50 text-indigo-400' : 
                    messageType === 'success' ? 'bg-indigo-500/15 border-indigo-500/50 text-indigo-400' : 'bg-rose-500/15 border-rose-500/50 text-rose-400'
                }`}>
                    {loading ? <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div> : 
                    messageType === 'success' ? <AiOutlineCheckCircle size={28} /> : <AiOutlineWarning size={28} />}
                    <span className="font-bold uppercase tracking-widest text-sm">{loading ? "Synchronizing Vault..." : (messageType === 'success' ? successMsg : errorMsg)}</span>
                    {!loading && <button onClick={() => setMessage(false)} className="ml-4 hover:text-white transition-colors"><IoClose size={24} /></button>}
                </div>
            )}

            <Menu />

            <main className="flex-1 lg:ml-80 p-8 md:p-16 transition-all">
                <div className="max-w-4xl mx-auto">
                    
                    {/* Header Section */}
                    <div className="mb-12 flex flex-col gap-6">
                        <button 
                            onClick={() => navigate(-1)} 
                            className="flex items-center gap-3 text-indigo-400 hover:text-white transition-colors font-bold text-base group w-max"
                        >
                            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Links
                        </button>
                        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter">
                            Edit <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent italic">Useful Link</span>
                        </h1>
                    </div>

                    {/* Edit Form Card */}
                    <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl p-10 md:p-14 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 blur-[100px] rounded-full"></div>
                        
                        <div className="space-y-10">
                            {/* Platform Input */}
                            <div className="space-y-4">
                                <label className="text-gray-500 text-xs font-black uppercase tracking-[0.4em] ml-2 flex items-center gap-3">
                                    <FaGlobe className="text-indigo-500/50" /> Platform Name
                                </label>
                                <input
                                    type="text"
                                    name="plateform"
                                    value={formData.plateform}
                                    onChange={handleChange}
                                    placeholder="Enter platform name (e.g., YouTube)"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-8 py-5 text-white text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                                />
                            </div>

                            {/* Link Input */}
                            <div className="space-y-4">
                                <label className="text-gray-500 text-xs font-black uppercase tracking-[0.4em] ml-2 flex items-center gap-3">
                                    <FaLink className="text-indigo-500/50" /> Resource URL
                                </label>
                                <input
                                    type="text"
                                    name="link"
                                    value={formData.link}
                                    onChange={handleChange}
                                    placeholder="Enter the URL"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-8 py-5 text-white text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all font-mono"
                                />
                            </div>

                            {/* Update Button */}
                            <div className="pt-8 border-t border-white/10">
                                <button 
                                    onClick={handleUpdate} 
                                    className="shimmer-btn w-full md:w-max px-16 py-6 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.3em] text-xs rounded-lg transition-all shadow-2xl shadow-indigo-600/30 active:scale-95 flex items-center justify-center gap-4"
                                >
                                    <FaSave size={18} /> Update Resource
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EditLink;