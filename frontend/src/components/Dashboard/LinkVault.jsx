import React, { useEffect, useState } from 'react'
import Menu from '../Menu/Menu'
import LoaderSpinner from '../loader/loader';
import { FaEdit, FaLink, FaTrashAlt, FaExternalLinkAlt, FaGlobe, FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AiOutlineCheckCircle, AiOutlineWarning } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';
import axios from 'axios';

const LinkVault = () => {
    const [linkCreds, setLinkCreds] = useState([]);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [messageType, setMessageType] = useState('');
    const [message, setMessage] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingError, setLoadingError] = useState(false);
    const [revealLink, setRevealLink] = useState({});

    // Custom Modal States
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const uniqueId = localStorage.getItem("uniqueId");
    const navigate = useNavigate();
    const LINK_URL = `${import.meta.env.VITE_API_KEY}/link`;

    const triggerToast = (type, msg) => {
        setMessageType(type);
        type === "success" ? setSuccessMsg(msg) : setErrorMsg(msg);
        setMessage(true);
        setTimeout(() => setMessage(false), 3000);
    };

    const getData = async () => {
        try {
            setLoading(true); 
            setLoadingError(false);
            const res = await axios.get(LINK_URL);
            const linksData = res.data.link;

            const filtered = linksData.filter(item => item.uniqueId == uniqueId);
            setLinkCreds(filtered);
        } catch (error) {
            setLoadingError(true);
            triggerToast("error", "Network synchronization failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id) => {
        navigate(`/edit-cred-link/${id}`);
    };

    const initiateDelete = (id) => {
        setItemToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            await axios.delete(`${LINK_URL}/${itemToDelete}`);
            triggerToast("success", "Link purged successfully.");
            getData();
        } catch (error) {
            triggerToast("error", "Could not remove link.");
        } finally {
            setShowDeleteModal(false);
            setItemToDelete(null);
        }
    };

    const toggleReveal = (id) => {
        setRevealLink(prev => ({ ...prev, [id]: !prev[id] }));
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="min-h-screen bg-[#06021b] flex font-sans selection:bg-indigo-500/30 overflow-x-hidden">
            {/* --- INLINE ANIMATIONS --- */}
            <style>
                {`
                    @keyframes slideIn { 0% { transform: translateX(100%); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
                    @keyframes scaleUp { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
                    .animate-toast { animation: slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                    .animate-scale-up { animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
                    .link-card:hover { box-shadow: 0 0 40px -10px rgba(79, 70, 229, 0.4); border-color: rgba(79, 70, 229, 0.5); }
                `}
            </style>

            {/* --- CUSTOM DELETE MODAL --- */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={() => setShowDeleteModal(false)}></div>
                    <div className="relative bg-[#0b032d] border border-white/10 rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl animate-scale-up">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-rose-500/10 rounded-3xl flex items-center justify-center text-rose-500 mb-8 border border-rose-500/20">
                                <FaExclamationTriangle size={40} />
                            </div>
                            <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Purge Link?</h3>
                            <p className="text-gray-400 text-lg font-medium mb-10 leading-relaxed">
                                Are you sure? This saved resource will be permanently removed from your collection.
                            </p>
                            <div className="flex gap-6 w-full">
                                <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-5 px-8 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all uppercase tracking-widest text-xs">
                                    Cancel
                                </button>
                                <button onClick={confirmDelete} className="flex-1 py-5 px-8 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-2xl transition-all shadow-lg shadow-rose-600/30 uppercase tracking-widest text-xs">
                                    Confirm Purge
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- TOAST NOTIFICATIONS --- */}
            {message && (
                <div className={`fixed top-8 right-8 z-[100] flex items-center gap-5 px-8 py-6 rounded-3xl shadow-2xl border backdrop-blur-3xl animate-toast ${
                    messageType === 'success' ? 'bg-indigo-500/15 border-indigo-500/50 text-indigo-400' : 'bg-rose-500/15 border-rose-500/50 text-rose-400'
                }`}>
                    {messageType === 'success' ? <AiOutlineCheckCircle size={28} /> : <AiOutlineWarning size={28} />}
                    <span className="font-bold uppercase tracking-widest text-sm">{messageType === 'success' ? successMsg : errorMsg}</span>
                    <button onClick={() => setMessage(false)} className="ml-4 hover:text-white transition-colors">
                        <IoClose size={24} />
                    </button>
                </div>
            )}

            <Menu />

            <main className="flex-1 lg:ml-80 p-8 md:p-16 transition-all">
                <div className="max-w-7xl mx-auto">
                    
                    {/* Header Section */}
                    <div className="mb-16">
                        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter">
                            Stored <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent italic">Links</span>
                        </h1>
                        <p className="text-gray-400 mt-4 text-xl font-medium tracking-wide flex items-center gap-3">
                            <FaLink className="text-indigo-500" /> Secure archive of {linkCreds.length} curated resources.
                        </p>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {loading ? (
                            <div className="col-span-full h-80 flex flex-col items-center justify-center gap-6 bg-white/5 rounded-[3rem] border border-white/10">
                                <LoaderSpinner />
                                <p className="text-indigo-400 font-black uppercase tracking-widest text-sm animate-pulse">Accessing Encrypted Links...</p>
                            </div>
                        ) : loadingError ? (
                            <div className="col-span-full p-16 bg-rose-500/5 border border-rose-500/20 rounded-[3rem] text-center">
                                <AiOutlineWarning size={56} className="text-rose-500 mx-auto mb-6" />
                                <p className="text-white text-2xl font-bold">Failed to load resource vault.</p>
                                <button onClick={getData} className="mt-6 text-rose-400 underline text-lg font-bold">Retry Synchronization</button>
                            </div>
                        ) : linkCreds.length === 0 ? (
                            <div className="col-span-full p-20 bg-white/5 border border-white/10 rounded-[3rem] text-center">
                                <FaLink size={64} className="text-indigo-500/20 mx-auto mb-6" />
                                <p className="text-gray-400 text-xl font-medium">No saved links detected.</p>
                                <button onClick={() => navigate('/links')} className="mt-6 text-indigo-400 font-black uppercase tracking-widest text-sm hover:text-white transition-colors">Save New Resource</button>
                            </div>
                        ) : (
                            linkCreds.map((val) => (
                                <div key={val._id} className="link-card relative group bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 transition-all duration-300">
                                    
                                    {/* Edit/Delete Buttons (Visible on Hover) */}
                                    <div className="absolute top-8 right-8 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEdit(val._id)} className="p-4 bg-indigo-600/20 text-indigo-400 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-lg shadow-indigo-600/20">
                                            <FaEdit size={18} />
                                        </button>
                                        <button onClick={() => initiateDelete(val._id)} className="p-4 bg-rose-500/15 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-500/20">
                                            <FaTrashAlt size={18} />
                                        </button>
                                    </div>

                                    <div className="space-y-8">
                                        {/* Platform Section */}
                                        <div>
                                            <label className="text-indigo-400/60 text-xs font-black uppercase tracking-[0.4em] flex items-center gap-3 mb-3">
                                                <FaGlobe /> Platform
                                            </label>
                                            <p className="text-white font-bold text-2xl truncate pr-14 italic tracking-tight uppercase">
                                                {val.plateform || "General Resource"}
                                            </p>
                                        </div>

                                        {/* Link Section */}
                                        <div className="pt-8 border-t border-white/10">
                                            <label className="text-gray-500 text-xs font-black uppercase tracking-[0.4em] flex items-center gap-3 mb-4">
                                                <FaLink size={10} /> Resource URL
                                            </label>
                                            
                                            <div className="flex flex-col gap-4">
                                                <div 
                                                    className="bg-white/5 rounded-2xl px-6 py-5 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors"
                                                    onClick={() => toggleReveal(val._id)}
                                                >
                                                    <p className={`text-sm font-mono break-all leading-relaxed ${revealLink[val._id] ? 'text-indigo-300' : 'text-gray-600 underline decoration-indigo-500/30'}`}>
                                                        {revealLink[val._id] ? val.link : "Click to view full URL"}
                                                    </p>
                                                </div>

                                                <a 
                                                    href={val.link} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="w-full py-4 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-xl border border-indigo-600/30 flex items-center justify-center gap-3 font-black uppercase tracking-widest text-[10px] transition-all group/link"
                                                >
                                                    Visit Website <FaExternalLinkAlt className="group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LinkVault;