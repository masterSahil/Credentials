import React, { useEffect, useState } from 'react'
import Menu from '../Menu/Menu'
import LoaderSpinner from '../loader/loader'
import { FaEdit, FaTrash, FaImages, FaPlayCircle, FaFileAlt, FaExclamationTriangle, FaShieldAlt, FaExternalLinkAlt } from 'react-icons/fa';
import axios from 'axios';
import { AiOutlineCheckCircle, AiOutlineWarning } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import defaultImg from '../../assets/imgs/default.png';

const MediaVault = () => {
    const [loadingError, setLoadingError] = useState(false);
    const [dataFetched, setDataFetched] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [messageType, setMessageType] = useState('');
    const [message, setMessage] = useState(false);
    const [IMG, setIMG] = useState([]);
    
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [activeVideo, setActiveVideo] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // Endpoint remains the same, but the data returned will have 'imageUrl'
    const API_URL = `${import.meta.env.VITE_API_KEY}/img`;
    const uniqueId = localStorage.getItem("uniqueId");
    const navigate = useNavigate();

    const triggerToast = (type, msg) => {
        setMessageType(type);
        type === "success" ? setSuccessMsg(msg) : setErrorMsg(msg);
        setMessage(true);
        setTimeout(() => setMessage(false), 3000);
    };

    const getData = async () => {
        try {
            setLoadingError(false);
            setDataFetched(false);
            const res = await axios.get(API_URL);
            const images = res.data.data;
            // Filter by the user's unique identification
            const filtered = images.filter(img => img.uniqueId === uniqueId);
            setIMG(filtered);
            setDataFetched(true);
        } catch (error) {
            setLoadingError(true);
            setDataFetched(true);
            triggerToast("error", "Failed to synchronize media library.");
        }
    };

    const initiateDelete = (id) => {
        setItemToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            // This hits exports.deleteImgData which destroys the Cloudinary asset too
            await axios.delete(`${API_URL}/${itemToDelete}`);
            triggerToast("success", "Media purged from cloud successfully.");
            getData();
        } catch (error) {
            triggerToast("error", "Security Breach: Could not purge media.");
        } finally {
            setShowDeleteModal(false);
            setItemToDelete(null);
        }
    };

    const updateMedia = (id) => {
        navigate(`/media-edits/${id}`);
    };

    const openVideo = (url) => {
        setActiveVideo(url);
        setShowVideoModal(true);
    };

    const closeVideo = () => {
        setActiveVideo(null);
        setShowVideoModal(false);
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="min-h-screen bg-[#06021b] flex font-sans selection:bg-indigo-500/30 overflow-x-hidden">
            <style>
                {`
                    @keyframes slideIn { 0% { transform: translateX(100%); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
                    @keyframes scaleUp { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
                    .animate-toast { animation: slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                    .animate-scale-up { animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
                    .media-card:hover { box-shadow: 0 0 40px -10px rgba(79, 70, 229, 0.4); border-color: rgba(79, 70, 229, 0.5); }
                `}
            </style>

            {/* DELETE MODAL */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-6 sm:p-6">

                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/85 backdrop-blur-md"
                        onClick={() => setShowDeleteModal(false)}
                    ></div>

                    {/* Modal Box */}
                    <div className="relative bg-[#0b032d] border border-white/10 rounded-xl 
                                    p-6 sm:p-8 md:p-10 
                                    max-w-sm sm:max-w-md md:max-w-lg w-full 
                                    shadow-2xl animate-scale-up text-center">

                        {/* Icon */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 
                                        bg-rose-500/10 rounded-xl 
                                        flex items-center justify-center 
                                        text-rose-500 mx-auto mb-5 sm:mb-6 md:mb-8 
                                        border border-rose-500/20">

                            <FaExclamationTriangle size={28} className="sm:hidden" />
                            <FaExclamationTriangle size={34} className="hidden sm:block md:hidden" />
                            <FaExclamationTriangle size={40} className="hidden md:block" />

                        </div>

                        {/* Title */}
                        <h3 className="text-xl sm:text-2xl md:text-3xl 
                                    font-black text-white uppercase tracking-tighter 
                                    mb-3 sm:mb-4">

                            Purge Cloud Asset?
                        </h3>

                        {/* Description */}
                        <p className="text-gray-400 
                                    text-sm sm:text-base md:text-lg 
                                    font-medium mb-6 sm:mb-8 md:mb-10 
                                    leading-relaxed">

                            This will permanently delete the file from both our vault and Cloudinary servers.
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6">

                            {/* Cancel */}
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 py-3 sm:py-4 md:py-5 
                                        bg-white/5 hover:bg-white/10 
                                        text-white font-bold rounded-xl 
                                        transition-all uppercase tracking-widest 
                                        text-[10px] sm:text-xs"
                            >
                                Cancel
                            </button>

                            {/* Confirm */}
                            <button
                                onClick={confirmDelete}
                                className="flex-1 py-3 sm:py-4 md:py-5 
                                        bg-rose-600 hover:bg-rose-500 
                                        text-white font-black rounded-xl 
                                        transition-all shadow-lg shadow-rose-600/30 
                                        uppercase tracking-widest 
                                        text-[10px] sm:text-xs"
                            >
                                Confirm Purge
                            </button>

                        </div>
                    </div>
                </div>
            )}

            {/* TOAST MESSAGE */}
            {message && (
                <div className={`fixed top-8 right-8 z-[100] flex items-center gap-5 px-8 py-6 rounded-xl shadow-2xl border backdrop-blur-3xl animate-toast ${
                    messageType === 'success' ? 'bg-indigo-500/15 border-indigo-500/50 text-indigo-400' : 'bg-rose-500/15 border-rose-500/50 text-rose-400'
                }`}>
                    {messageType === 'success' ? <AiOutlineCheckCircle size={28} /> : <AiOutlineWarning size={28} />}
                    <span className="font-bold uppercase tracking-widest text-sm">{messageType === 'success' ? successMsg : errorMsg}</span>
                    <button onClick={() => setMessage(false)} className="ml-4 hover:text-white transition-colors"><IoClose size={24} /></button>
                </div>
            )}

            {/* VIDEO MODAL */}
            {showVideoModal && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">

                    {/* Background */}
                    <div
                        className="absolute inset-0 bg-black/90 backdrop-blur-lg"
                        onClick={closeVideo}
                    ></div>

                    {/* Player Box */}
                    <div className="relative w-full max-w-5xl bg-black rounded-xl overflow-hidden shadow-2xl animate-scale-up border border-white/10">

                        {/* Close Button */}
                        <button
                            onClick={closeVideo}
                            className="absolute top-4 right-4 z-20 bg-black/60 hover:bg-rose-500 text-white p-3 rounded-full transition-all"
                        >
                            <IoClose size={22} />
                        </button>

                        {/* Video */}
                        <video
                            src={activeVideo}
                            controls
                            autoPlay
                            className="w-full max-h-[80vh] object-contain bg-black"
                        />
                    </div>
                </div>
            )}

            <Menu />

            <main className="flex-1 lg:ml-80 p-8 md:p-16 transition-all">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16">
                        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter">
                            Media <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent italic">Vault Gallery</span>
                        </h1>
                        <p className="text-gray-400 mt-4 text-xl font-medium tracking-wide flex items-center gap-3">
                            <FaShieldAlt className="text-indigo-500" /> {IMG.length} cloud-stored media assets identified.
                        </p>
                    </div>

                    {!dataFetched ? (
                        <div className="h-96 flex flex-col items-center justify-center gap-6 bg-white/5 rounded-xl border border-white/10">
                            <LoaderSpinner />
                            <p className="text-indigo-400 font-black uppercase tracking-widest text-sm animate-pulse">Scanning Cloud Vault...</p>
                        </div>
                    ) : loadingError ? (
                        <div className="p-16 bg-rose-500/5 border border-rose-500/20 rounded-xl text-center">
                            <AiOutlineWarning size={56} className="text-rose-500 mx-auto mb-6" />
                            <p className="text-white text-2xl font-bold">Cloud Connection Interrupted.</p>
                            <button onClick={getData} className="mt-6 text-rose-400 underline text-lg font-bold">Retry Handshake</button>
                        </div>
                    ) : IMG.length === 0 ? (
                        <div className="p-20 bg-white/5 border border-white/10 rounded-xl text-center">
                            <FaImages size={64} className="text-indigo-500/20 mx-auto mb-6" />
                            <p className="text-gray-400 text-xl font-medium">Your cloud vault is currently empty.</p>
                            <button onClick={() => navigate('/cloud-medias')} className="mt-6 text-indigo-400 font-black uppercase tracking-widest text-sm hover:text-white">Upload New Asset</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                            {IMG.map((val) => {
                                // ✨ FIX: Use val.imageUrl directly from Cloudinary
                                const filePath = val.imageUrl;
                                const extension = filePath ? filePath.split('.').pop().toLowerCase() : '';
                                
                                // Detect media type for rendering
                                const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension);
                                const isVideo = ['mp4', 'webm', 'ogg', 'mov'].includes(extension);

                                return (
                                    <div key={val._id} className="media-card group relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl overflow-hidden transition-all duration-300">
                                        
                                        {/* Actions */}
                                        <div className="absolute top-4 right-4 flex gap-2 z-20 opacity-100 lg:opacity-100 transition-opacity">
                                            <button onClick={() => updateMedia(val._id)} className="p-3 bg-indigo-600/90 lg:bg-indigo-600/20 text-white lg:text-indigo-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all backdrop-blur-md"><FaEdit size={18} /></button>
                                            <button onClick={() => initiateDelete(val._id)} className="p-3 bg-rose-500/90 lg:bg-rose-500/15 text-white lg:text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all backdrop-blur-md"><FaTrash size={18} /></button>
                                        </div>

                                        {/* Media Preview */}
                                        <div className="h-64 w-full bg-black/40 flex items-center justify-center relative overflow-hidden">
                                            {!filePath ? (
                                                <img src={defaultImg} className="h-full w-full object-cover opacity-50" alt="Missing" />
                                            ) : isImage ? (
                                                <img src={filePath} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" alt={val.name} onError={(e) => (e.target.src = defaultImg)} />
                                            ) : isVideo ? (
                                                <div
                                                    onClick={() => openVideo(filePath)}
                                                    className="relative w-full h-full cursor-pointer"
                                                >
                                                    {/* Video preview - often Cloudinary supports posters/thumbnails but here we use the video itself */}
                                                    <video src={filePath} className="w-full h-full object-cover" muted />
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                                        <FaPlayCircle size={48} className="text-white/80" />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-4 text-indigo-500/40">
                                                    <FaFileAlt size={64} />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">{extension || 'FILE'}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Metadata Content */}
                                        <div className="p-8">
                                            <h2 className="text-white text-2xl font-bold truncate mb-2 uppercase tracking-tight">{val.name || "Untitled Asset"}</h2>
                                            <p className="text-gray-500 text-lg font-medium line-clamp-2 leading-relaxed h-14">
                                                {val.desc || "No encrypted metadata provided."}
                                            </p>
                                            
                                            <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                                                <span className="text-indigo-400/60 text-[10px] font-black uppercase tracking-widest italic">
                                                    Cloud Asset • {extension || 'Raw'}
                                                </span>
                                                <button 
                                                    onClick={() => window.open(filePath, '_blank')} 
                                                    className="flex items-center gap-2 text-white/40 hover:text-indigo-400 text-xs font-bold transition-all"
                                                >
                                                    View Source <FaExternalLinkAlt size={10} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default MediaVault;