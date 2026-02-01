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
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
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
        <div className="min-h-screen bg-[#06021b] flex font-sans overflow-hidden">

            {/* Animations */}
            <style>
                {`
                    @keyframes slideIn {
                        0% { transform: translateX(100%); opacity: 0; }
                        100% { transform: translateX(0); opacity: 1; }
                    }

                    .animate-toast {
                        animation: slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                    }

                    .shimmer-btn {
                        position: relative;
                        overflow: hidden;
                    }

                    .shimmer-btn::after {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: -150%;
                        width: 50%;
                        height: 100%;
                        background: rgba(255, 255, 255, 0.15);
                        transform: skewX(-25deg);
                        transition: 0.7s;
                    }

                    .shimmer-btn:hover::after {
                        left: 150%;
                    }
                `}
            </style>

            {/* Toast */}
            {(message || loading) && (
                <div className={`fixed top-6 right-4 sm:right-8 z-[100] flex items-center gap-4 px-5 py-4 sm:px-8 sm:py-6 rounded-xl shadow-2xl border backdrop-blur-3xl animate-toast ${
                    loading
                        ? 'bg-indigo-500/15 border-indigo-500/50 text-indigo-400'
                        : messageType === 'success'
                            ? 'bg-indigo-500/15 border-indigo-500/50 text-indigo-400'
                            : 'bg-rose-500/15 border-rose-500/50 text-rose-400'
                }`}>
                    {loading ? (
                        <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : messageType === 'success' ? (
                        <AiOutlineCheckCircle size={24} />
                    ) : (
                        <AiOutlineWarning size={24} />
                    )}

                    <span className="font-bold uppercase tracking-widest text-xs sm:text-sm">
                        {loading ? "Synchronizing..." : (messageType === 'success' ? successMsg : errorMsg)}
                    </span>

                    {!loading && (
                        <button
                            onClick={() => setMessage(false)}
                            className="hover:text-white transition-colors"
                        >
                            <IoClose size={20} />
                        </button>
                    )}
                </div>
            )}

            <Menu />

            {/* Main */}
            <main className="flex-1 lg:ml-80 px-4 py-6 sm:px-6 sm:py-8 md:p-16 transition-all">

                <div className="max-w-4xl mx-auto">

                    {/* Header */}
                    <div className="mb-10 flex flex-col gap-5">

                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-3 text-indigo-400 hover:text-white transition-colors font-bold text-sm sm:text-base w-max"
                        >
                            <FaArrowLeft /> Back to Links
                        </button>

                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tighter">
                            Edit{" "}
                            <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent italic">
                                Useful Link
                            </span>
                        </h1>
                    </div>

                    {/* Card */}
                    <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl p-6 sm:p-8 md:p-14 shadow-2xl relative overflow-hidden">

                        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/5 blur-[90px] rounded-full"></div>

                        <div className="space-y-8 sm:space-y-10">

                            {/* Platform */}
                            <div className="space-y-3">
                                <label className="text-gray-500 text-xs font-black uppercase tracking-[0.3em] ml-1 flex items-center gap-2">
                                    <FaGlobe className="text-indigo-500/50" /> Platform Name
                                </label>
                                <input
                                    type="text"
                                    name="plateform"
                                    value={formData.plateform}
                                    onChange={handleChange}
                                    placeholder="Enter platform name"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 sm:px-6 sm:py-4 text-white text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                                />
                            </div>

                            {/* Link */}
                            <div className="space-y-3">
                                <label className="text-gray-500 text-xs font-black uppercase tracking-[0.3em] ml-1 flex items-center gap-2">
                                    <FaLink className="text-indigo-500/50" /> Resource URL
                                </label>

                                <input
                                    type="text"
                                    name="link"
                                    value={formData.link}
                                    onChange={handleChange}
                                    placeholder="Enter URL"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 sm:px-6 sm:py-4 text-white text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all font-mono"
                                />
                            </div>

                            {/* Button */}
                            <div className="pt-6 border-t border-white/10">
                                <button
                                    onClick={handleUpdate}
                                    className="shimmer-btn w-full sm:w-auto px-8 sm:px-16 py-4 sm:py-6 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.25em] text-xs rounded-lg transition-all shadow-2xl shadow-indigo-600/30 active:scale-95 flex items-center justify-center gap-3"
                                >
                                    <FaSave size={16} />
                                    Update Resource
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