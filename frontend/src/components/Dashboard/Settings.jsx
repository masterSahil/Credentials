import React, { useEffect, useState } from 'react'
import Menu from '../Menu/Menu'
import axios from 'axios';
import { FaEye, FaEyeSlash, FaUserEdit, FaLock, FaUserCircle } from 'react-icons/fa';
import { AiOutlineCheckCircle, AiOutlineWarning } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';

const Settings = () => {
    const [userData, setUserData] = useState({
        userName: '',
        email: '',
        password: '',
        phone: '',
        dob: '',
        gender: '',
    });

    const [pId, setPId] = useState('');
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [messageType, setMessageType] = useState('');
    const [message, setMessage] = useState(false);

    const id = localStorage.getItem("uniqueId");
    const URL = `${import.meta.env.VITE_API_KEY}/users`;

    const triggerToast = (type, msg) => {
        setMessageType(type);
        type === "success" ? setSuccessMsg(msg) : setErrorMsg(msg);
        setMessage(true);
        setTimeout(() => setMessage(false), 3000);
    };

    const getData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(URL);
            const person = res.data.user;
            const matchedUser = person.find(p => p.uniqueId === id);

            if (matchedUser) {
                setUserData({
                    userName: matchedUser.userName,
                    email: matchedUser.email,
                    password: matchedUser.password,
                    phone: matchedUser.phone,
                    dob: matchedUser.dob ? new Date(matchedUser.dob).toISOString().split('T')[0] : '',
                    gender: matchedUser.gender,
                });
                setPId(matchedUser._id);
            }
        } catch (error) {
            triggerToast("error", error.message);
        } finally {
            setLoading(false);
        }
    };

    const update = async () => {
        try {
            await axios.put(`${URL}/${pId}`, userData);
            triggerToast("success", "Profile Updated Successfully");
        } catch (error) {
            triggerToast("error", error.message);
        }
    };

    const handleChange = (e) => {
        setUserData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    useEffect(() => {
        getData();
    }, []);

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
                    input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1); cursor: pointer; }
                `}
            </style>

            {/* --- TOAST / LOADING NOTIFICATION --- */}
            {(message || loading) && (
                <div className={`fixed top-6 right-6 z-[100] flex items-center gap-4 px-6 py-5 rounded-xl shadow-2xl border backdrop-blur-3xl animate-toast ${
                    loading ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' : 
                    messageType === 'success' ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' : 'bg-rose-500/10 border-rose-500/50 text-rose-400'
                }`}>
                    {loading ? <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div> : 
                    messageType === 'success' ? <AiOutlineCheckCircle size={24} /> : <AiOutlineWarning size={24} />}
                    <span className="font-black uppercase tracking-widest text-[11px]">{loading ? "Synchronizing Data..." : (messageType === 'success' ? successMsg : errorMsg)}</span>
                    {!loading && <button onClick={() => setMessage(false)} className="ml-2 hover:text-white transition-colors"><IoClose size={18} /></button>}
                </div>
            )}

            <Menu />

            <main className="flex-1 lg:ml-80 p-6 md:p-12 transition-all">
                <div className="max-w-4xl mx-auto">
                    
                    {/* Header Section */}
                    <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                                Account <span className="bg-linear-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent italic">Settings</span>
                            </h1>
                            <p className="text-gray-500 mt-2 font-semibold tracking-wide flex items-center gap-2">
                               <FaUserEdit className="text-indigo-500/50" /> Manage your personal information and security.
                            </p>
                        </div>
                        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                            <div className="h-12 w-12 rounded-lg bg-indigo-600/20 flex items-center justify-center text-indigo-400">
                                <FaUserCircle size={28} />
                            </div>
                            <div>
                                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Active User</p>
                                <p className="text-white font-bold text-sm">{userData.userName || "Loading..."}</p>
                            </div>
                        </div>
                    </div>

                    {/* Settings Form Card */}
                    <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[80px] rounded-full"></div>
                        
                        <header className="mb-10 flex items-center gap-4">
                            <div className="h-10 w-1.5 bg-indigo-600 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-widest">Personal Profile</h2>
                        </header>

                        <div className="space-y-10">
                            {/* Grid Group 1: Name & Email */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-gray-500 text-[10px] font-black uppercase tracking-[0.25em] ml-2">Full Name</label>
                                    <input 
                                        type="text" name="userName" value={userData.userName || ''} onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-gray-500 text-[10px] font-black uppercase tracking-[0.25em] ml-2">Email Address</label>
                                    <input 
                                        type="email" name="email" value={userData.email || ''} onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Grid Group 2: Password & Phone */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-gray-500 text-[10px] font-black uppercase tracking-[0.25em] ml-2">Account Password</label>
                                    <div className="relative">
                                        <input 
                                            type={visible ? "text" : "password"} name="password" value={userData.password || ''} onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                                        />
                                        <button onClick={() => setVisible(!visible)} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-400">
                                            {visible ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-gray-500 text-[10px] font-black uppercase tracking-[0.25em] ml-2">Phone Number</label>
                                    <input 
                                        type="number" name="phone" value={userData.phone || ''} onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Grid Group 3: DOB & Gender */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-gray-500 text-[10px] font-black uppercase tracking-[0.25em] ml-2">Date of Birth</label>
                                    <input 
                                        type="date" name="dob" value={userData.dob || ''} onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-gray-500 text-[10px] font-black uppercase tracking-[0.25em] ml-2">Gender Identity</label>
                                    <input 
                                        type="text" name="gender" value={userData.gender || ''} onChange={handleChange}
                                        placeholder="e.g. Male, Female, Non-binary"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Update Button */}
                            <div className="pt-4 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-3 text-indigo-400/60">
                                    <FaLock size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Changes are secured by AES-256</span>
                                </div>
                                <button 
                                    onClick={update}
                                    className="shimmer-btn w-full md:w-max px-14 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.3em] text-[11px] rounded-lg transition-all shadow-2xl shadow-indigo-600/30 active:scale-95"
                                >
                                    Update Profile
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Settings;