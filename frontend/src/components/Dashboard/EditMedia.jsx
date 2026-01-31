import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Menu from '../Menu/Menu';
import { AiOutlineCheckCircle, AiOutlineWarning } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';
import { FaArrowLeft, FaCloudUploadAlt, FaTrash, FaExternalLinkAlt, FaFileSignature, FaParagraph, FaExclamationTriangle, FaShieldAlt, FaSpinner } from 'react-icons/fa';
import defaultImg from '../../assets/imgs/default.png';
import filesImg from '../../assets/imgs/files.png';

const EditMedia = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Matching state keys to Backend Schema
    const [imgData, setImgData] = useState({ name: '', desc: '', imageUrl: '', imagePublicId: '' });
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [messageType, setMessageType] = useState('');
    const [message, setMessage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Endpoints
    const API_URL = `${import.meta.env.VITE_API_KEY}/img`; 
    const IMAGE_FILE_URL = `${import.meta.env.VITE_API_KEY}/image`; 

    const triggerToast = (type, msg) => {
        setMessageType(type);
        type === "success" ? setSuccessMsg(msg) : setErrorMsg(msg);
        setMessage(true);
        setTimeout(() => setMessage(false), 3000);
    };

    const getData = async () => {
        try {
            setLoading(true);
            const res = await axios.get(API_URL);
            const found = res.data.data.find(img => img._id === id);
            if (found) setImgData(found);
        } catch (error) {
            triggerToast("error", "Error Fetching Media Data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { getData(); }, [id]);

    const handleChange = async (e) => {
        const { name, type, files, value } = e.target;
        
        if (type === "file") {
            const file = files[0];
            if (!file) return;
            try {
                setLoading(true);
                const formData = new FormData();
                formData.append('image', file); // 'image' must match backend upload.single('image')
                
                triggerToast("success", "Replacing Cloud Asset...");
                
                // Hits exports.updateImg on backend
                await axios.put(`${IMAGE_FILE_URL}/${id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                
                triggerToast("success", "File Updated in Cloud");
                setTimeout(getData, 1500); // Reload fresh URL
            } catch (error) {
                triggerToast("error", "Upload failed: " + error.message);
            } finally {
                setLoading(false);
            }
        } else {
            setImgData(prev => ({ ...prev, [name]: value }));
        }
    };

    const updateMetadata = async () => {
        try {
            setLoading(true);
            // Hits exports.updateImgData on backend
            await axios.put(`${API_URL}/${id}`, {
                name: imgData.name,
                desc: imgData.desc
            });
            triggerToast("success", "Metadata Updated Successfully");
            setTimeout(() => navigate('/media-creds'), 1500);
        } catch (error) {
            triggerToast("error", "Update Failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenLink = () => {
        if (imgData.imageUrl) {
            window.open(imgData.imageUrl, '_blank', 'noopener,noreferrer');
        } else {
            triggerToast("error", "URL not found.");
        }
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            triggerToast("success", "Media Purged Successfully");
            setTimeout(() => navigate('/media-creds'), 1500);
        } catch (error) {
            triggerToast("error", "Purge Failed.");
        } finally {
            setShowDeleteModal(false);
        }
    };

    const renderFilePreview = () => {
        const fileURL = imgData.imageUrl;
        if (!fileURL) return <img src={defaultImg} className="h-full w-full object-cover opacity-40" alt="Default" />;

        const ext = fileURL.split('.').pop().toLowerCase();

        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
            return <img src={fileURL} className="h-full w-full object-contain" alt="Preview" />;
        }
        if (['mp4', 'webm', 'ogg', 'mov'].includes(ext)) {
            return <video src={fileURL} controls className="h-full w-full rounded-2xl" />;
        }
        return <img src={filesImg} className="h-48 w-48 object-contain opacity-60" alt="Document" />;
    };

    return (
        <div className="min-h-screen bg-[#06021b] flex font-sans selection:bg-indigo-500/30 overflow-x-hidden">
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

            {showDeleteModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={() => setShowDeleteModal(false)}></div>
                    <div className="relative bg-[#0b032d] border border-white/10 rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl animate-scale-up text-center">
                        <div className="w-24 h-24 bg-rose-500/10 rounded-3xl flex items-center justify-center text-rose-500 mx-auto mb-8 border border-rose-500/20">
                            <FaExclamationTriangle size={40} />
                        </div>
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Purge Asset?</h3>
                        <p className="text-gray-400 text-lg font-medium mb-10 leading-relaxed">This will remove the file from Cloudinary and our Vault forever.</p>
                        <div className="flex gap-6">
                            <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-5 bg-white/5 text-white font-bold rounded-2xl uppercase tracking-widest text-xs">Cancel</button>
                            <button onClick={confirmDelete} className="flex-1 py-5 bg-rose-600 text-white font-black rounded-2xl shadow-lg shadow-rose-600/30 uppercase tracking-widest text-xs">Confirm Purge</button>
                        </div>
                    </div>
                </div>
            )}

            {(message || loading) && (
                <div className={`fixed top-8 right-8 z-[100] flex items-center gap-5 px-8 py-6 rounded-3xl shadow-2xl border backdrop-blur-3xl animate-toast ${
                    loading ? 'bg-indigo-500/15 border-indigo-500/50 text-indigo-400' :
                    messageType === 'success' ? 'bg-indigo-500/15 border-indigo-500/50 text-indigo-400' : 'bg-rose-500/15 border-rose-500/50 text-rose-400'
                }`}>
                    {loading ? <FaSpinner className="animate-spin" size={24} /> : (messageType === 'success' ? <AiOutlineCheckCircle size={28} /> : <AiOutlineWarning size={28} />)}
                    <span className="font-bold uppercase tracking-widest text-sm">{loading ? "Syncing Cloud Data..." : (messageType === 'success' ? successMsg : errorMsg)}</span>
                    {!loading && <button onClick={() => setMessage(false)} className="ml-4 hover:text-white transition-colors"><IoClose size={24} /></button>}
                </div>
            )}

            <Menu />

            <main className="flex-1 lg:ml-80 p-8 md:p-16 transition-all">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-12 flex flex-col gap-6">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-3 text-indigo-400 hover:text-white transition-colors font-bold text-base group w-max">
                            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back
                        </button>
                        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter">
                            Edit <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent italic">Cloud Asset</span>
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">
                        <div className="xl:col-span-2 space-y-6">
                            <div className="bg-black/40 border border-white/10 rounded-[2.5rem] h-[400px] flex items-center justify-center overflow-hidden relative shadow-inner">
                                {renderFilePreview()}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <label className="shimmer-btn flex items-center justify-center gap-3 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/30 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] cursor-pointer transition-all">
                                    <FaCloudUploadAlt size={18} /> Update File
                                    <input type="file" name="image" accept="image/*,video/*" onChange={handleChange} hidden />
                                </label>
                                <button onClick={handleOpenLink} className="shimmer-btn flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all">
                                    <FaExternalLinkAlt size={16} /> Open Link
                                </button>
                                <button onClick={() => setShowDeleteModal(true)} className="col-span-2 shimmer-btn flex items-center justify-center gap-3 bg-rose-500/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-500/30 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all">
                                    <FaTrash size={16} /> Purge from Vault
                                </button>
                            </div>
                        </div>

                        <div className="xl:col-span-3 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 md:p-14 shadow-2xl space-y-10">
                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <label className="text-gray-500 text-xs font-black uppercase tracking-[0.4em] ml-2 flex items-center gap-3">
                                        <FaFileSignature className="text-indigo-500/50" /> Display Name
                                    </label>
                                    <input type="text" name="name" value={imgData.name} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-gray-500 text-xs font-black uppercase tracking-[0.4em] ml-2 flex items-center gap-3">
                                        <FaParagraph className="text-indigo-500/50" /> Description
                                    </label>
                                    <textarea name="desc" value={imgData.desc} onChange={handleChange} rows="5" className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none" />
                                </div>

                                <button onClick={updateMetadata} className="shimmer-btn w-full px-16 py-6 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.3em] text-xs rounded-2xl transition-all shadow-2xl shadow-indigo-600/30">
                                    Save Metadata
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