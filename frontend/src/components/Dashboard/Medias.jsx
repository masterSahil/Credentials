import React, { useRef, useState } from 'react';
import Menu from '../Menu/Menu';
import axios from 'axios';
import { AiOutlineCheckCircle, AiOutlineWarning } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { FaCloudUploadAlt, FaFileSignature, FaParagraph, FaImages, FaArrowRight, FaSpinner } from 'react-icons/fa';

const Medias = () => {
    const [data, setData] = useState({
        imageFile: null,
        name: '',
        desc: '',
    });

    const [previewUrl, setPreviewUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState({ active: false, type: '', text: '' });

    const inputRef = useRef();
    const navigate = useNavigate();

    // Renamed from 'URL' to avoid conflict with browser built-in
    const API_URL = `${import.meta.env.VITE_API_KEY}/img`;

    const triggerToast = (type, msg) => {
        setMessage({ active: true, type, text: msg });
        setTimeout(() => setMessage({ active: false, type: '', text: '' }), 3000);
    };

    const handleChange = (e) => {
        const { name, type, value, files } = e.target;

        if (type === "file") {
            const file = files[0];
            if (file) {
                setData(prev => ({ ...prev, imageFile: file }));
                // Uses window.URL to create a local preview
                setPreviewUrl(window.URL.createObjectURL(file));
            }
        } else {
            setData(prev => ({ ...prev, [name]: value }));
        }
    };

    const upload = async (e) => {
        e.preventDefault();
        const uniqueId = localStorage.getItem("uniqueId");

        if (!uniqueId) return triggerToast("error", "Please login first.");
        if (!data.imageFile) return triggerToast("error", "Select a file.");
        if (!data.name.trim()) return triggerToast("error", "Enter a display name.");

        setIsUploading(true);

        const formData = new FormData();
        // MUST match upload.single('image') in backend
        formData.append('image', data.imageFile);
        formData.append('name', data.name.trim());
        formData.append('desc', data.desc || "");
        formData.append('uniqueId', uniqueId);

        try {
            const res = await axios.post(API_URL, formData);

            console.log(res);
            if (res.data.success) {
                triggerToast("success", "Media Vaulted Successfully");
                setData({ imageFile: null, name: '', desc: '' });
                setPreviewUrl(null);
                if (inputRef.current) inputRef.current.value = null;
            }
        } catch (error) {
            console.error("Upload failed:", error);
            triggerToast("error", error.response?.data?.message || "Server Error 500");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#06021b] flex font-sans selection:bg-indigo-500/30 overflow-x-hidden">
            {message.active && (
                <div className={`fixed top-6 right-6 z-[100] flex items-center gap-4 px-6 py-5 rounded-xl shadow-2xl border backdrop-blur-3xl ${message.type === 'success' ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' : 'bg-rose-500/10 border-rose-500/50 text-rose-400'
                    }`}>
                    {message.type === 'success' ? <AiOutlineCheckCircle size={24} /> : <AiOutlineWarning size={24} />}
                    <span className="font-black uppercase tracking-widest text-[11px]">{message.text}</span>
                    <button onClick={() => setMessage({ ...message, active: false })} className="ml-2 hover:text-white transition-colors">
                        <IoClose size={18} />
                    </button>
                </div>
            )}

            <Menu />

            <main className="flex-1 lg:ml-80 p-6 md:p-12 transition-all">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-12">
                        Secure <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent italic">Media Vault</span>
                    </h1>

                    <form className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                        <div className="space-y-8">
                            <div className="group relative">
                                <label className="text-gray-500 text-[10px] font-black uppercase tracking-[0.25em] ml-2 block mb-3">Select Video or Image</label>
                                <div className="relative min-h-[160px] border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-4 hover:border-indigo-500/50 hover:bg-white/5 transition-all cursor-pointer p-4">
                                    <input type="file" name="image" accept="image/*,video/*" onChange={handleChange} ref={inputRef} className="absolute inset-0 opacity-0 cursor-pointer z-50" />

                                    {!previewUrl ? (
                                        <>
                                            <FaCloudUploadAlt className="text-indigo-500 text-3xl group-hover:scale-110 transition-transform" />
                                            <span className="text-gray-500 text-xs font-medium">Click to upload media</span>
                                        </>
                                    ) : (
                                        <div className="w-full flex flex-col items-center gap-2">
                                            {data.imageFile?.type.startsWith('video/') ? (
                                                <video src={previewUrl} className="h-32 rounded-xl border border-white/20" muted />
                                            ) : (
                                                <img src={previewUrl} alt="Preview" className="h-32 rounded-xl object-cover border border-white/20" />
                                            )}
                                            <p className="text-indigo-400 text-[10px] font-bold">File: {data.imageFile.name}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-gray-500 text-[10px] font-black uppercase tracking-[0.25em] ml-2">File Name</label>
                                    <input type="text" name="name" onChange={handleChange} value={data.name} placeholder="e.g. Vacation Video" className="w-full bg-white/5 border border-white/10 rounded-lg px-6 py-4 text-white placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-gray-500 text-[10px] font-black uppercase tracking-[0.25em] ml-2">Description</label>
                                    <textarea name="desc" value={data.desc} onChange={handleChange} placeholder="Optional notes..." className="w-full bg-white/5 border border-white/10 rounded-lg px-6 py-4 text-white h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
                                </div>
                            </div>

                            <button onClick={upload} disabled={isUploading} className={`w-full md:w-max px-14 py-5 bg-indigo-600 text-white font-black uppercase tracking-[0.3em] text-[11px] rounded-lg transition-all shadow-2xl flex items-center justify-center gap-3 ${isUploading ? 'opacity-70' : 'hover:bg-indigo-500 active:scale-95'}`}>
                                {isUploading ? <><FaSpinner className="animate-spin" /> Uploading...</> : "Secure Upload"}
                            </button>
                        </div>
                    </form>
                    {/* Navigation Section to Media Gallery */}
                    <div
                        className="mt-8 bg-gradient-to-r from-indigo-950/30 to-black border border-white/5 rounded-xl p-8 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-indigo-500/40 transition-all cursor-pointer"
                        onClick={() => navigate('/media-creds')}
                    >
                        <div className="flex items-center gap-6">
                            <div className="h-16 w-16 rounded-lg bg-indigo-600/20 flex items-center justify-center text-indigo-500 shadow-[inset_0_0_20px_rgba(79,70,229,0.15)] transition-transform group-hover:scale-110">
                                <FaImages size={28} />
                            </div>
                            <div>
                                <h4 className="text-white font-black text-xl uppercase tracking-wider">Browse Media Gallery</h4>
                                <p className="text-gray-500 text-sm font-medium">View, manage, and download your vaulted images and videos.</p>
                            </div>
                        </div>
                        <button className="bg-white text-black px-10 py-4 rounded-lg font-black uppercase tracking-widest text-[11px] hover:bg-indigo-50 transition-all flex items-center gap-3">
                            Open Gallery <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Medias;