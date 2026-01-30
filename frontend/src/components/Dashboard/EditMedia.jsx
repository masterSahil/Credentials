import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Menu from '../Menu/Menu';
import { AiOutlineCheckCircle, AiOutlineWarning } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';
import { FaArrowLeft, FaCloudUploadAlt, FaTrash, FaDownload, FaFileSignature, FaParagraph, FaExclamationTriangle, FaShieldAlt } from 'react-icons/fa';
import defaultImg from '../../assets/imgs/default.png';
import filesImg from '../../assets/imgs/files.png';

const EditMedia = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [imgData, setImgData] = useState({ name: '', desc: '', image: '' });
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [messageType, setMessageType] = useState('');
    const [message, setMessage] = useState(false);
    const [loading, setLoading] = useState(false);

    // Custom Modal States
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const URL = `${import.meta.env.VITE_API_KEY}/img`;
    const IMAGE_URL = `${import.meta.env.VITE_API_KEY}/image`;

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
            const data = res.data.data;
            const found = data.find(img => img._id == id);
            if (found) setImgData(found);
        } catch (error) {
            triggerToast("error", "Error Fetching Data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { getData(); }, []);

    const handleChange = async (e) => {
        const { name, type, files, value } = e.target;
        if (type === "file") {
            const file = files[0];
            if (!file) return;
            try {
                const formData = new FormData();
                formData.append('image', file);
                triggerToast("success", "Uploading updated file...");
                await axios.put(`${IMAGE_URL}/${id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setTimeout(getData, 1200);
            } catch (error) {
                triggerToast("error", "Upload failed: " + error.message);
            }
        } else {
            setImgData(prev => ({ ...prev, [name]: value }));
        }
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`${IMAGE_URL}/${id}`);
            triggerToast("success", "File Purged Successfully");
            setTimeout(() => navigate('/cloud-medias'), 2000);
        } catch (error) {
            triggerToast("error", "Failed to purge media.");
        } finally {
            setShowDeleteModal(false);
        }
    };

    const updateMetadata = async () => {
        try {
            await axios.put(`${URL}/${id}`, imgData);
            triggerToast("success", "Metadata Updated Successfully");
            setTimeout(() => navigate('/cloud-medias'), 2000);
        } catch (error) {
            triggerToast("error", "Update Failed.");
        }
    };

    const handleDownload = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_KEY}/check/${id}`);
            if (response.data.exists) {
                window.location.href = `${import.meta.env.VITE_API_KEY}/download/${id}`;
            } else {
                triggerToast("error", "File not available for download.");
            }
        } catch (err) {
            triggerToast("error", "Download check failed.");
        }
    };

    const renderFilePreview = () => {
        const file = imgData.image;
        if (!file) return <img src={defaultImg} className="h-full w-full object-cover opacity-40" alt="Default" />;
        const getExt = (name) => name.split('.').pop().toLowerCase();
        let fileURL = typeof file === 'string' ? `${import.meta.env.VITE_API_KEY}/uploads/${file}` : window.URL.createObjectURL(file);
        const ext = getExt(typeof file === 'string' ? file : file.name);

        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return <img src={fileURL} className="h-full w-full object-contain" alt="Preview" />;
        if (['mp4', 'webm', 'ogg'].includes(ext)) return <video src={fileURL} controls className="h-full w-full" />;
        return <img src={filesImg} className="h-48 w-48 object-contain opacity-60" alt="Document" />;
    };

    return (
        <div className="min-h-screen bg-[#06021b] flex font-sans selection:bg-indigo-500/30 overflow-x-hidden">
            {/* --- INLINE UI ANIMATIONS --- */}
            <style>
                {`
                    @keyframes slideIn { 0% { transform: translateX(100%); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
                    @keyframes scaleUp { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
                    .animate-toast { animation: slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                    .animate-scale-up { animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
                    .shimmer-btn { position: relative; overflow: hidden; }
                    .shimmer-btn::after { content: ''; position: absolute; top: 0; left: -150%; width: 50%; height: 100%; background: rgba(255, 255, 255, 0.15); transform: skewX(-25deg); transition: 0.7s; }
                    .shimmer-btn:hover::after { left: 150%; }
                `}
            </style>

            {/* --- CUSTOM DELETE MODAL --- */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={() => setShowDeleteModal(false)}></div>
                    <div className="relative bg-[#0b032d] border border-white/10 rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl animate-scale-up text-center">
                        <div className="w-24 h-24 bg-rose-500/10 rounded-3xl flex items-center justify-center text-rose-500 mx-auto mb-8 border border-rose-500/20">
                            <FaExclamationTriangle size={40} />
                        </div>
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Purge Media?</h3>
                        <p className="text-gray-400 text-lg font-medium mb-10 leading-relaxed">Are you sure? This asset will be permanently removed from your vault. This cannot be undone.</p>
                        <div className="flex gap-6">
                            <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all uppercase tracking-widest text-xs">Cancel</button>
                            <button onClick={confirmDelete} className="flex-1 py-5 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-2xl transition-all shadow-lg shadow-rose-600/30 uppercase tracking-widest text-xs">Confirm Purge</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- TOAST / LOADING --- */}
            {(message || loading) && (
                <div className={`fixed top-8 right-8 z-[100] flex items-center gap-5 px-8 py-6 rounded-3xl shadow-2xl border backdrop-blur-3xl animate-toast ${
                    loading ? 'bg-indigo-500/15 border-indigo-500/50 text-indigo-400' :
                    messageType === 'success' ? 'bg-indigo-500/15 border-indigo-500/50 text-indigo-400' : 'bg-rose-500/15 border-rose-500/50 text-rose-400'
                }`}>
                    {loading ? <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div> :
                    messageType === 'success' ? <AiOutlineCheckCircle size={28} /> : <AiOutlineWarning size={28} />}
                    <span className="font-bold uppercase tracking-widest text-sm">{loading ? "Synchronizing Asset..." : (messageType === 'success' ? successMsg : errorMsg)}</span>
                    {!loading && <button onClick={() => setMessage(false)} className="ml-4 hover:text-white transition-colors"><IoClose size={24} /></button>}
                </div>
            )}

            <Menu />

            <main className="flex-1 lg:ml-80 p-8 md:p-16 transition-all">
                <div className="max-w-6xl mx-auto">
                    
                    <div className="mb-12 flex flex-col gap-6">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-3 text-indigo-400 hover:text-white transition-colors font-bold text-base group w-max">
                            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Media Library
                        </button>
                        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter">
                            Edit <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent italic">Media Profile</span>
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">
                        {/* LEFT: Preview Chamber */}
                        <div className="xl:col-span-2 space-y-6">
                            <div className="bg-black/40 border border-white/10 rounded-[2.5rem] h-[400px] flex items-center justify-center overflow-hidden relative shadow-inner">
                                {renderFilePreview()}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#06021b] via-transparent to-transparent pointer-events-none opacity-40"></div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <label className="shimmer-btn flex items-center justify-center gap-3 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/30 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] cursor-pointer transition-all active:scale-95">
                                    <FaCloudUploadAlt size={18} /> Replace
                                    <input type="file" name="image" onChange={handleChange} hidden />
                                </label>
                                <button onClick={handleDownload} className="shimmer-btn flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95">
                                    <FaDownload size={16} /> Download
                                </button>
                                <button onClick={() => setShowDeleteModal(true)} className="col-span-2 shimmer-btn flex items-center justify-center gap-3 bg-rose-500/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-500/30 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95">
                                    <FaTrash size={16} /> Purge from Vault
                                </button>
                            </div>
                        </div>

                        {/* RIGHT: Metadata Editor */}
                        <div className="xl:col-span-3 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 md:p-14 shadow-2xl space-y-10">
                            <header className="flex items-center gap-4">
                                <FaShieldAlt className="text-indigo-500" size={24} />
                                <h2 className="text-2xl font-black text-white uppercase tracking-widest">Asset Metadata</h2>
                            </header>

                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <label className="text-gray-500 text-xs font-black uppercase tracking-[0.4em] ml-2 flex items-center gap-3">
                                        <FaFileSignature className="text-indigo-500/50" /> Display Name
                                    </label>
                                    <input type="text" name="name" value={imgData?.name || ""} onChange={handleChange} placeholder="Enter asset name..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all" />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-gray-500 text-xs font-black uppercase tracking-[0.4em] ml-2 flex items-center gap-3">
                                        <FaParagraph className="text-indigo-500/50" /> Description
                                    </label>
                                    <textarea name="desc" value={imgData?.desc || ""} onChange={handleChange} rows="5" placeholder="Add some context to this media..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all resize-none" />
                                </div>

                                <button onClick={updateMetadata} className="shimmer-btn w-full px-16 py-6 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.3em] text-xs rounded-2xl transition-all shadow-2xl shadow-indigo-600/30 active:scale-95">
                                    Update Metadata
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EditMedia;