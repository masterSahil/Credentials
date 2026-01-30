import React, { useEffect, useRef, useState } from 'react'
import Menu from '../Menu/Menu'
import axios from 'axios';
import { AiOutlineCheckCircle, AiOutlineWarning } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { FaCloudUploadAlt, FaFileSignature, FaParagraph, FaImages, FaArrowRight } from 'react-icons/fa';

const Medias = () => {
    const [data, setData] = useState({
        image: '',
        name: null,
        desc: '',
    });

    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [messageType, setMessageType] = useState('');
    const [message, setMessage] = useState(false);

    const inputRef = useRef();
    const navigate = useNavigate();

    const URL = `${import.meta.env.VITE_API_KEY}/img`;
    const uniqueId = localStorage.getItem("uniqueId");

    const triggerToast = (type, msg) => {
        setMessageType(type);
        type === "success" ? setSuccessMsg(msg) : setErrorMsg(msg);
        setMessage(true);
        setTimeout(() => setMessage(false), 3000);
    };

    const handleChange = (e) => {
        const { name, type, value, files } = e.target;
        setData(prev => ({ ...prev, [name]: type === "file" ? files[0] : value }));
    }

    const upload = async (e) => {
        e.preventDefault();
        try {
            if (!uniqueId) return triggerToast("error", "User not identified. Please login again.");
            
            if (!data.image || !data.name?.trim()) {
                return triggerToast("error", !data.image ? "Please select a file." : "Please enter a display name.");
            }

            const formData = new FormData();
            formData.append('image', data.image);
            formData.append('name', data.name);
            formData.append('desc', data.desc);
            formData.append('uniqueId', uniqueId);

            await axios.post(URL, formData, { headers: { "Content-Type": "multipart/form-data" } });

            triggerToast("success", "Media Vaulted Successfully");
            setData({ image: '', name: '', desc: '' });
            if (inputRef.current) inputRef.current.value = null;

        } catch (error) {
            triggerToast("error", error.message || "Upload failed.");
        }
    }

    return (
        <div className="min-h-screen bg-[#06021b] flex font-sans selection:bg-indigo-500/30 overflow-x-hidden">
            <style>
                {`
                    @keyframes slideIn { 0% { transform: translateX(100%); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
                    .animate-toast { animation: slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                    .shimmer-btn { position: relative; overflow: hidden; }
                    .shimmer-btn::after { content: ''; position: absolute; top: 0; left: -150%; width: 50%; height: 100%; background: rgba(255, 255, 255, 0.15); transform: skewX(-25deg); transition: 0.7s; }
                    .shimmer-btn:hover::after { left: 150%; }
                `}
            </style>

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

            <Menu />

            <main className="flex-1 lg:ml-80 p-6 md:p-12 transition-all">
                <div className="max-w-4xl mx-auto">
                    
                    <div className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                            Secure <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent italic">Media Vault</span>
                        </h1>
                        <p className="text-gray-500 mt-2 font-semibold tracking-wide flex items-center gap-2">
                           <FaImages className="text-indigo-500/50" /> End-to-end encrypted storage for your private files.
                        </p>
                    </div>

                    <form method="post" className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[80px] rounded-full"></div>
                        
                        <header className="mb-10 flex items-center gap-4">
                            <div className="h-10 w-1.5 bg-indigo-600 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-widest">Upload New File</h2>
                        </header>

                        <div className="space-y-8">
                            {/* File Input */}
                            <div className="group relative">
                                <label className="text-gray-500 text-[10px] font-black uppercase tracking-[0.25em] ml-2 block mb-3">Select Document or Image</label>
                                <div className="relative h-32 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-2 hover:border-indigo-500/50 hover:bg-white/5 transition-all cursor-pointer">
                                    <input type="file" name="image" onChange={handleChange} ref={inputRef} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                    <FaCloudUploadAlt className="text-indigo-500 text-3xl group-hover:scale-110 transition-transform" />
                                    <span className="text-gray-500 text-xs font-medium">
                                        {data.image ? `Selected: ${data.image.name}` : "Browse or drag and drop"}
                                    </span>
                                </div>
                            </div>

                            {/* VERTICAL STACKED FIELDS */}
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-gray-500 text-[10px] font-black uppercase tracking-[0.25em] ml-2">File Display Name</label>
                                    <div className="relative">
                                        <input 
                                            type="text" placeholder="e.g. Identity Proof" name="name"
                                            onChange={handleChange} value={data.name || ""}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4.5 text-white placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:bg-white/10 transition-all"
                                        />
                                        <FaFileSignature className="absolute right-6 top-1/2 -translate-y-1/2 text-indigo-500/30" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-gray-500 text-[10px] font-black uppercase tracking-[0.25em] ml-2">Description (Optional)</label>
                                    <div className="relative">
                                        <textarea 
                                            name="desc" value={data.desc || ""} onChange={handleChange} 
                                            placeholder="Brief notes about this file..."
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4.5 text-white placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:bg-white/10 transition-all resize-none h-[100px]"
                                        />
                                        <FaParagraph className="absolute right-6 top-6 text-indigo-500/30" />
                                    </div>
                                </div>
                            </div>

                            <button onClick={upload} className="shimmer-btn w-full md:w-max px-14 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.3em] text-[11px] rounded-2xl transition-all shadow-2xl shadow-indigo-600/30 active:scale-95">
                                Secure Upload
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 bg-gradient-to-r from-indigo-950/30 to-black border border-white/5 rounded-[2.5rem] p-8 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-indigo-400/40 transition-all cursor-pointer" onClick={() => navigate('/media-creds')}>
                        <div className="flex items-center gap-6">
                            <div className="h-16 w-16 rounded-3xl bg-indigo-600/20 flex items-center justify-center text-indigo-500 transition-transform group-hover:scale-110">
                                <FaImages size={28} />
                            </div>
                            <div>
                                <h4 className="text-white font-black text-xl uppercase tracking-wider">Browse Media Gallery</h4>
                                <p className="text-gray-500 text-sm font-medium">View and manage your encrypted documents and images.</p>
                            </div>
                        </div>
                        <button className="bg-white text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-indigo-50 transition-all flex items-center gap-3">
                            Open Gallery <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Medias;