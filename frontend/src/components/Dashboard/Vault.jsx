import React, { useEffect, useState } from 'react'
import Menu from '../Menu/Menu'
import LoaderSpinner from '../loader/loader';
import { FaEdit, FaEye, FaEyeSlash, FaTrashAlt, FaShieldAlt, FaGlobe, FaUserAlt, FaEnvelope, FaLock, FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AiOutlineCheckCircle, AiOutlineWarning } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';
import axios from 'axios';

const Vault = () => {
    const [loadingError, setLoadingError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [revealMap, setRevealMap] = useState({});
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [messageType, setMessageType] = useState('');
    const [message, setMessage] = useState(false);
    const [credData, setCredData] = useState([]);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const URL_WEB = `${import.meta.env.VITE_API_KEY}/web`;
    const navigate = useNavigate();

    const triggerToast = (type, msg) => {
        setMessageType(type);
        type === "success" ? setSuccessMsg(msg) : setErrorMsg(msg);
        setMessage(true);
        setTimeout(() => setMessage(false), 3000);
    };

    const toggleReveal = (id) => {
        setRevealMap(prev => ({...prev, [id]: !prev[id] }));
    };

    const getData = async () => {
        try {
            setLoading(true); 
            setLoadingError(false);
            const resWeb = await axios.get(URL_WEB);
            let uniqueId = localStorage.getItem("uniqueId");
            let allCreds = resWeb.data.user;

            if (uniqueId) {
                const filteredCreds = allCreds.filter(cred => cred.uniqueId === uniqueId);
                setCredData(filteredCreds);
            } else {
                setCredData([]);
            }
        } catch (error) {
            setLoadingError(true);
            triggerToast("error", "Failed to synchronize vault data.");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id) => {
        navigate(`/credential-details/${id}`);
    }
    
    const initiateDelete = (id) => {
        setItemToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            await axios.delete(`${URL_WEB}/${itemToDelete}`);
            triggerToast("success", "Record purged from vault.");
            getData();
        } catch (error) {
            triggerToast("error", "Decline: Could not delete record.");
        } finally {
            setShowDeleteModal(false);
            setItemToDelete(null);
        }
    };

    useEffect(() => {
        getData();
    }, [])

    return (
        <div className="min-h-screen bg-[#06021b] flex font-sans selection:bg-indigo-500/30 overflow-x-hidden">
            <style>
                {`
                    @keyframes slideIn { 0% { transform: translateX(100%); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
                    @keyframes scaleUp { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
                    .animate-toast { animation: slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                    .animate-scale-up { animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
                    .card-glow:hover { box-shadow: 0 0 40px -10px rgba(79, 70, 229, 0.4); border-color: rgba(79, 70, 229, 0.5); }
                `}
            </style>

            {/* --- RESPONSIVE DELETE MODAL --- */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-6 sm:p-6">

                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/85 backdrop-blur-md"
                        onClick={() => setShowDeleteModal(false)}
                    ></div>

                    {/* Modal Box */}
                    <div className="relative w-full max-w-md sm:max-w-lg bg-[#0b032d] border border-white/10 rounded-xl p-6 sm:p-8 md:p-10 shadow-2xl animate-scale-up">

                        <div className="flex flex-col items-center text-center">

                            {/* Icon */}
                            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500 mb-6 sm:mb-8 border border-rose-500/20">
                                <FaExclamationTriangle size={32} className="sm:hidden" />
                                <FaExclamationTriangle size={36} className="hidden sm:block md:hidden" />
                                <FaExclamationTriangle size={40} className="hidden md:block" />
                            </div>

                            {/* Title */}
                            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-3 sm:mb-4">
                                Purge Link?
                            </h3>

                            {/* Description */}
                            <p className="text-gray-400 text-sm sm:text-base md:text-lg font-medium mb-6 sm:mb-8 leading-relaxed max-w-sm">
                                Are you sure? This saved resource will be permanently removed from your collection.
                            </p>

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 w-full">

                                {/* Cancel */}
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="w-full sm:flex-1 py-3 sm:py-4 md:py-5 px-6 sm:px-8 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all uppercase tracking-widest text-[10px] sm:text-xs"
                                >
                                    Cancel
                                </button>

                                {/* Confirm */}
                                <button
                                    onClick={confirmDelete}
                                    className="w-full sm:flex-1 py-3 sm:py-4 md:py-5 px-6 sm:px-8 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl transition-all shadow-lg shadow-rose-600/30 uppercase tracking-widest text-[10px] sm:text-xs"
                                >
                                    Confirm Purge
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- TOAST NOTIFICATION --- */}
            {message && (
                <div className={`fixed top-8 right-8 z-[100] flex items-center gap-5 px-8 py-6 rounded-xl shadow-2xl border backdrop-blur-3xl animate-toast ${
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
                    
                    <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter">
                                Stored <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent italic">Credentials</span>
                            </h1>
                            <p className="text-gray-400 mt-4 text-xl font-medium tracking-wide flex items-center gap-3">
                               <FaShieldAlt className="text-indigo-500" /> Managing {credData.length} active encrypted records.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {loading ? (
                            <div className="col-span-full h-80 flex flex-col items-center justify-center gap-6 bg-white/5 rounded-xl border border-white/10">
                                <LoaderSpinner />
                                <p className="text-indigo-400 font-black uppercase tracking-widest text-sm animate-pulse">Decrypting Vault...</p>
                            </div>
                        ) : loadingError ? (
                            <div className="col-span-full p-16 bg-rose-500/5 border border-rose-500/20 rounded-xl text-center">
                                <AiOutlineWarning size={56} className="text-rose-500 mx-auto mb-6" />
                                <p className="text-white text-2xl font-bold">Synchronization failed.</p>
                                <button onClick={getData} className="mt-6 text-rose-400 underline text-lg font-bold">Retry Link</button>
                            </div>
                        ) : credData.length === 0 ? (
                            <div className="col-span-full p-20 bg-white/5 border border-white/10 rounded-xl text-center">
                                <FaLock size={64} className="text-indigo-500/20 mx-auto mb-6" />
                                <p className="text-gray-400 text-xl font-medium">Vault directory is currently empty.</p>
                                <button onClick={() => navigate('/')} className="mt-6 text-indigo-400 font-black uppercase tracking-widest text-sm hover:text-white transition-colors">Add Initial Entry</button>
                            </div>
                        ) : (
                            credData.map((val) => (
                                <div key={val._id} className="card-glow relative group bg-white/5 backdrop-blur-3xl border border-white/10 rounded-lg p-10 transition-all duration-300">
                                    
                                    <div className="absolute top-8 right-8 flex gap-3 opacity-100 transition-opacity">
                                        <button onClick={() => handleEdit(val._id)} className="p-4 bg-indigo-600/20 text-indigo-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-lg shadow-indigo-600/20">
                                            <FaEdit size={18} />
                                        </button>
                                        <button onClick={() => initiateDelete(val._id)} className="p-4 bg-rose-500/15 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-500/20">
                                            <FaTrashAlt size={18} />
                                        </button>
                                    </div>

                                    <div className="space-y-8">
                                        <div>
                                            <label className="text-indigo-400/60 text-xs font-black uppercase tracking-[0.4em] flex items-center gap-3 mb-3">
                                                <FaGlobe /> Website Platform
                                            </label>
                                            <p className="text-white font-bold text-2xl truncate pr-14">{val.webName || "Not Provided"}</p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-6 pt-6 border-t border-white/10">
                                            <div>
                                                <label className="text-gray-500 text-xs font-black uppercase tracking-[0.4em] flex items-center gap-3 mb-2">
                                                    <FaUserAlt size={10} /> User ID
                                                </label>
                                                <p className="text-gray-200 text-lg font-semibold truncate">{val.userName || "N/A"}</p>
                                            </div>
                                            <div>
                                                <label className="text-gray-500 text-xs font-black uppercase tracking-[0.4em] flex items-center gap-3 mb-2">
                                                    <FaEnvelope size={10} /> Email
                                                </label>
                                                <p className="text-gray-200 text-lg font-semibold truncate">{val.email || "N/A"}</p>
                                            </div>
                                        </div>

                                        <div className="pt-6">
                                            <label className="text-gray-500 text-xs font-black uppercase tracking-[0.4em] flex items-center gap-3 mb-3">
                                                <FaLock size={10} /> Security Key
                                            </label>
                                            <div className="flex items-center justify-between bg-white/5 rounded-lg p-4 border border-white/5 group/pass">
                                                <span className={`text-base font-mono tracking-widest ${revealMap[val._id] ? 'text-indigo-400' : 'text-gray-600'}`}>
                                                    {revealMap[val._id] ? val.password : "••••••••"}
                                                </span>
                                                <button onClick={() => toggleReveal(val._id)} className="text-gray-500 hover:text-white transition-colors">
                                                    {revealMap[val._id] ? <FaEyeSlash size={22} /> : <FaEye size={22} />}
                                                </button>
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

export default Vault;