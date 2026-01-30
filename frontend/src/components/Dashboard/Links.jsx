import React, { useEffect, useState } from 'react'
import Menu from '../Menu/Menu'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AiOutlineCheckCircle, AiOutlineWarning } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';
import { FaLink, FaExternalLinkAlt, FaArrowRight, FaGlobe } from 'react-icons/fa';

const Links = () => {
    const [linkData, setLinkData] = useState({
        plateform: '', // Keeping your original key name
        link: '',
    });

    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [messageType, setMessageType] = useState('');
    const [message, setMessage] = useState(false);

    const LINK_URL = `${import.meta.env.VITE_API_KEY}/link`;
    const uniqueId = localStorage.getItem("uniqueId");
    const navigate = useNavigate();

    const triggerToast = (type, msg) => {
        setMessageType(type);
        type === "success" ? setSuccessMsg(msg) : setErrorMsg(msg);
        setMessage(true);
        setTimeout(() => setMessage(false), 3000);
    };

    const submit = async () => {
        try {
            if (!uniqueId) {
                return triggerToast("error", "User not identified. Please login again.");
            }

            const emptyField = Object.entries(linkData).find(([key, value]) => !value?.trim());
            if (emptyField) {
                return triggerToast("error", `Please provide the ${emptyField[0]}.`);
            }

            const newData = { ...linkData, uniqueId };
            await axios.post(LINK_URL, newData);

            triggerToast("success", "Link Saved Successfully");
            setLinkData({ plateform: '', link: '' });
        } catch (error) {
            triggerToast("error", error.message || "Failed to save link.");
        }
    };

    const handleChange = (e) => {
        setLinkData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    return (
        <div className="min-h-screen bg-[#06021b] flex font-sans selection:bg-indigo-500/30 overflow-x-hidden">
            {/* --- INLINE UI ANIMATIONS --- */}
            <style>
                {`
                    @keyframes slideIn {
                        0% { transform: translateX(100%); opacity: 0; }
                        100% { transform: translateX(0); opacity: 1; }
                    }
                    .animate-toast { animation: slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                    .shimmer-btn { position: relative; overflow: hidden; }
                    .shimmer-btn::after {
                        content: ''; position: absolute; top: 0; left: -150%; width: 50%; height: 100%;
                        background: rgba(255, 255, 255, 0.15); transform: skewX(-25deg); transition: 0.7s;
                    }
                    .shimmer-btn:hover::after { left: 150%; }
                `}
            </style>

            {/* --- TOAST NOTIFICATION --- */}
            {message && (
                <div className={`fixed top-6 right-6 z-[100] flex items-center gap-4 px-6 py-5 rounded-2xl shadow-2xl border backdrop-blur-3xl animate-toast ${
                    messageType === 'success' ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' : 'bg-rose-500/10 border-rose-500/50 text-rose-400'
                }`}>
                    {messageType === 'success' ? <AiOutlineCheckCircle size={24} /> : <AiOutlineWarning size={24} />}
                    <span className="font-black uppercase tracking-widest text-[11px]">{messageType === 'success' ? successMsg : errorMsg}</span>
                    <button onClick={() => setMessage(false)} className="ml-2 hover:text-white transition-colors">
                        <IoClose size={18} />
                    </button>
                </div>
            )}

            {/* --- SIDEBAR MENU --- */}
            <Menu />

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 lg:ml-80 p-6 md:p-12 transition-all">
                <div className="max-w-4xl mx-auto">
                    
                    {/* Header Section */}
                    <div className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                            Vault <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent italic">Useful Links</span>
                        </h1>
                        <p className="text-gray-500 mt-2 font-semibold tracking-wide flex items-center gap-2">
                           <FaGlobe className="text-indigo-500/50" /> Securely archive your most-visited digital destinations.
                        </p>
                    </div>

                    {/* Link Form Card */}
                    <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[80px] rounded-full"></div>
                        
                        <header className="mb-10 flex items-center gap-4">
                            <div className="h-10 w-1.5 bg-indigo-600 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-widest">Add New Resource</h2>
                        </header>

                        <div className="space-y-8">
                            {/* Platform Input */}
                            <div className="space-y-3">
                                <label className="text-gray-500 text-[10px] font-black uppercase tracking-[0.25em] ml-2">Platform / Name</label>
                                <div className="relative">
                                    <input 
                                        type="text" name="plateform" value={linkData.plateform} onChange={handleChange}
                                        placeholder="e.g. YouTube, Documentation, Portfolio"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4.5 text-white placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:bg-white/10 transition-all"
                                    />
                                    <FaExternalLinkAlt className="absolute right-6 top-1/2 -translate-y-1/2 text-indigo-500/30" />
                                </div>
                            </div>

                            {/* URL Input */}
                            <div className="space-y-3">
                                <label className="text-gray-500 text-[10px] font-black uppercase tracking-[0.25em] ml-2">Resource URL</label>
                                <div className="relative">
                                    <input 
                                        type="text" name="link" value={linkData.link} onChange={handleChange}
                                        placeholder="https://example.com/very-useful-page"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4.5 text-white placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:bg-white/10 transition-all font-mono text-sm"
                                    />
                                    <FaLink className="absolute right-6 top-1/2 -translate-y-1/2 text-indigo-500/30" />
                                </div>
                            </div>

                            {/* Save Button */}
                            <button 
                                onClick={submit}
                                className="shimmer-btn mt-4 w-full md:w-max px-14 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.3em] text-[11px] rounded-2xl transition-all shadow-2xl shadow-indigo-600/30 active:scale-95"
                            >
                                Secure Link
                            </button>
                        </div>
                    </div>

                    {/* Access Vault Card */}
                    <div className="mt-8 bg-gradient-to-r from-indigo-950/30 to-black border border-white/5 rounded-[2.5rem] p-8 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-indigo-500/40 transition-all cursor-pointer" onClick={() => navigate('/link-creds')}>
                        <div className="flex items-center gap-6">
                            <div className="h-16 w-16 rounded-3xl bg-indigo-600/20 flex items-center justify-center text-indigo-500 shadow-[inset_0_0_20px_rgba(79,70,229,0.15)] transition-transform group-hover:scale-110">
                                <FaLink size={28} />
                            </div>
                            <div>
                                <h4 className="text-white font-black text-xl uppercase tracking-wider">Manage Link Vault</h4>
                                <p className="text-gray-500 text-sm font-medium">Browse and edit your collection of stored resources.</p>
                            </div>
                        </div>
                        <button className="bg-white text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-indigo-50 transition-all flex items-center gap-3">
                            Open Vault <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Links;