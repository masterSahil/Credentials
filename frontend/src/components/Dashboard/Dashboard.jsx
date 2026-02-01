import React, { useEffect, useState } from 'react'
import Menu from '../Menu/Menu'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AiOutlineCheckCircle, AiOutlineWarning } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';
import { FaEye, FaEyeSlash, FaShieldAlt, FaArrowRight, FaKey } from 'react-icons/fa';

const Dashboard = () => {
    const [userName, setUserName] = useState('');
    const [userData, setUserData] = useState({ webName: '', userName: '', email: '', password: '' });
    const [message, setMessage] = useState(false);
    const [messageType, setMessageType] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const URL_USERS = `${import.meta.env.VITE_API_KEY}/users`;
    const URL_WEB = `${import.meta.env.VITE_API_KEY}/web`;

    const triggerToast = (type, msg) => {
        setMessageType(type);
        type === "success" ? setSuccessMsg(msg) : setErrorMsg(msg);
        setMessage(true);
        setTimeout(() => setMessage(false), 3000);
    }

    const getData = async () => {
        try {
            const resUsers = await axios.get(URL_USERS);
            const uniqueId = localStorage.getItem("uniqueId") || localStorage.getItem("emailId");
            const users = resUsers.data.user;
            const matchedUser = users.find(u => u.uniqueId === uniqueId || u.email === uniqueId);
            if (matchedUser) setUserName(matchedUser.userName);
        } catch (error) { triggerToast("error", "Network synchronization failed."); }
    };

    const submit = async () => {
        const uniqueId = localStorage.getItem("uniqueId");
        if (!userData.webName || !userData.password) return triggerToast("error", "Fields cannot be empty.");
        try {
            await axios.post(URL_WEB, { ...userData, uniqueId });
            triggerToast("success", "Record secured in vault.");
            setUserData({ webName: '', userName: '', email: '', password: '' });
        } catch (error) { triggerToast("error", "Failed to store record."); }
    };

    useEffect(() => { getData(); }, []);

    return (
        <div className="min-h-screen bg-[#06021b] flex font-sans selection:bg-indigo-500/30 overflow-x-hidden">
            <style>
                {`
                    @keyframes slideInToast {
                        0% { transform: translateX(100%); opacity: 0; }
                        100% { transform: translateX(0); opacity: 1; }
                    }
                    .animate-toast { animation: slideInToast 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                    .shimmer-btn { position: relative; overflow: hidden; }
                    .shimmer-btn::after {
                        content: ''; position: absolute; top: 0; left: -150%; width: 50%; height: 100%;
                        background: rgba(255, 255, 255, 0.15); transform: skewX(-25deg); transition: 0.7s;
                    }
                    .shimmer-btn:hover::after { left: 150%; }
                `}
            </style>

            <Menu />

            <main className="flex-1 lg:ml-80 p-6 md:p-12 transition-all">
                <div className="max-w-5xl mx-auto">
                    
                    {/* Header */}
                    <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                                Welcome, <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent italic">{userName || "User"}</span>
                            </h1>
                            <p className="text-gray-500 mt-2 font-semibold tracking-wide">Secure your digital keys in the private cloud.</p>
                        </div>
                        <div className="bg-indigo-500/10 border border-indigo-500/20 px-5 py-3 rounded-lg flex items-center gap-3 text-indigo-400 shadow-[0_0_20px_rgba(79,70,229,0.1)]">
                            <FaShieldAlt className="animate-pulse" size={20} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">AES-256 Protected</span>
                        </div>
                    </div>

                    {/* Store Form Card */}
                    <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">
                        <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-10 flex items-center gap-4">
                            <span className="h-10 w-1.5 bg-indigo-600 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.5)]"></span>
                            New Vault Entry
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                { label: 'Website Name', name: 'webName', ph: 'e.g. Netflix' },
                                { label: 'Username / ID', name: 'userName', ph: 'e.g. user_99' },
                                { label: 'Linked Email', name: 'email', ph: 'e.g. support@site.com' }
                            ].map((f) => (
                                <div key={f.name} className="space-y-3">
                                    <label className="text-gray-500 text-[10px] font-black uppercase tracking-[0.25em] ml-2">{f.label}</label>
                                    <input 
                                        type="text" name={f.name} value={userData[f.name]}
                                        onChange={(e) => setUserData({...userData, [e.target.name]: e.target.value})}
                                        placeholder={f.ph}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:bg-white/10 transition-all"
                                    />
                                </div>
                            ))}

                            <div className="space-y-3 relative">
                                <label className="text-gray-500 text-[10px] font-black uppercase tracking-[0.25em] ml-2">Access Password</label>
                                <div className="relative">
                                    <input 
                                        type={showPassword ? "text" : "password"} name="password" value={userData.password}
                                        onChange={(e) => setUserData({...userData, password: e.target.value})}
                                        placeholder="••••••••"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4.5 text-white placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:bg-white/10 transition-all"
                                    />
                                    <button onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                                        {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={submit}
                            className="shimmer-btn mt-10 w-full md:w-max px-14 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.3em] text-[11px] rounded-lg transition-all shadow-2xl shadow-indigo-600/30 active:scale-95"
                        >
                            Commit to Vault
                        </button>
                    </div>

                    {/* Secondary Navigation Card */}
                    <div className="mt-8 bg-gradient-to-r from-indigo-950/30 to-black border border-white/5 rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-indigo-500/40 transition-all cursor-pointer" onClick={() => navigate('/vault-creds')}>
                        <div className="flex items-center gap-6">
                            <div className="h-14 w-14 rounded-lg bg-indigo-600/20 flex items-center justify-center text-indigo-500 shadow-[inset_0_0_15px_rgba(79,70,229,0.1)]">
                                <FaKey size={24} />
                            </div>
                            <div>
                                <h4 className="text-white font-black text-lg uppercase tracking-wider">Review Records</h4>
                                <p className="text-gray-500 text-sm font-medium">Manage your encrypted credentials safely.</p>
                            </div>
                        </div>
                        <button className="bg-white text-black px-8 py-4 rounded-lg font-black uppercase tracking-widest text-[10px] hover:bg-indigo-50 transition-all flex items-center gap-3">
                            Open Vault <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>

                </div>
            </main>

            {/* Toast System */}
            {message && (
                <div className={`fixed top-6 right-6 z-[100] flex items-center gap-4 px-6 py-5 rounded-xl shadow-2xl border backdrop-blur-3xl animate-toast ${
                    messageType === 'success' ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' : 'bg-rose-500/10 border-rose-500/50 text-rose-400'
                }`}>
                    {messageType === 'success' ? <AiOutlineCheckCircle size={24} /> : <AiOutlineWarning size={24} />}
                    <span className="font-black uppercase tracking-widest text-[11px]">{messageType === 'success' ? successMsg : errorMsg}</span>
                </div>
            )}
        </div>
    );
};

export default Dashboard;