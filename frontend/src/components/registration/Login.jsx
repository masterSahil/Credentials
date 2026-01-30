import React, { useContext, useState } from 'react';
import signInIllustration from '../../assets/imgs/loginIllu.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { registeredContext } from '../Context/Context';
import { AiOutlineCheckCircle, AiOutlineWarning } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaShieldAlt, FaSpinner } from 'react-icons/fa';

const Login = () => {
    const [data, setData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [toast, setToast] = useState({ show: false, type: '', msg: '' });

    const navigate = useNavigate();
    const registerContext = useContext(registeredContext);
    const URL = `${import.meta.env.VITE_API_KEY}/users`;

    const triggerToast = (type, msg) => {
        setToast({ show: true, type, msg });
        setTimeout(() => setToast({ show: false, type: '', msg: '' }), 4000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setErrors(prev => ({ ...prev, [name]: '' }));
        setData(prev => ({ ...prev, [name]: value }));
    }

    const login = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axios.get(URL);
            const user = res.data.user.find(u => u.email === data.email && u.password === data.password);
            if (user) {
                triggerToast("success", "Access Granted. Welcome.");
                localStorage.setItem("isLoggedIn", "true");
                setTimeout(() => navigate('/'), 1500);
            } else {
                setErrors({ auth: "Invalid Credentials" });
            }
        } catch (error) {
            triggerToast("error", "Vault connection failed.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="h-screen w-full bg-[#06021b] flex items-center justify-center font-sans selection:bg-indigo-500/30 p-6 overflow-hidden relative">
            <style>
                {`
                    @keyframes fadeRight { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
                    @keyframes fadeUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
                    @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
                    @keyframes toastIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                    
                    .animate-fade-right { animation: fadeRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                    .animate-fade-up { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                    .animate-float { animation: float 5s ease-in-out infinite; }
                    .animate-toast { animation: toastIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                    
                    .glass-card { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(24px); border: 1px solid rgba(255, 255, 255, 0.08); }
                    .shimmer-btn { position: relative; overflow: hidden; }
                    .shimmer-btn::after { content: ''; position: absolute; top: 0; left: -150%; width: 50%; height: 100%; background: rgba(255, 255, 255, 0.1); transform: skewX(-25deg); transition: 0.8s; }
                    .shimmer-btn:hover::after { left: 150%; }
                `}
            </style>

            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-[40vw] h-[40vw] bg-indigo-600/10 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] bg-purple-600/10 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2" />

            {/* Toast */}
            {toast.show && (
                <div className={`fixed top-8 right-8 z-[100] flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl glass-card animate-toast ${toast.type === 'success' ? 'border-emerald-500/50 text-emerald-400' : 'border-rose-500/50 text-rose-400'}`}>
                    {toast.type === 'success' ? <AiOutlineCheckCircle size={22} /> : <AiOutlineWarning size={22} />}
                    <span className="font-bold uppercase tracking-widest text-[11px]">{toast.msg}</span>
                    <button onClick={() => setToast({ ...toast, show: false })} className="ml-2"><IoClose size={20} /></button>
                </div>
            )}

            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
                
                {/* --- LEFT: BRANDING (Fade Right) --- */}
                <div className="hidden lg:flex flex-col gap-8 animate-fade-right">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full">
                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
                            <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">Secure Node 01</span>
                        </div>
                        <h1 className="text-7xl font-black text-white leading-[0.85] tracking-tighter">
                            Access Your <br />
                            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent italic">Encrypted Vault</span>
                        </h1>
                    </div>
                    <img src={signInIllustration} className="w-full max-w-sm animate-float drop-shadow-2xl" alt="Vault" />
                </div>

                {/* --- RIGHT: FORM (Fade Up) --- */}
                <div className="flex justify-center lg:justify-end animate-fade-up">
                    <div className="w-full max-w-[420px] glass-card rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-[50px] rounded-full group-hover:bg-indigo-600/20 transition-all duration-700" />
                        
                        <header className="mb-8">
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Sign In</h2>
                            <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">Identity Verification Required</p>
                        </header>

                        <form className="space-y-5" onSubmit={login}>
                            <div className="relative group">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-400 transition-colors" />
                                <input 
                                    type="email" name="email" placeholder="Email Address" required
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-12 py-4 text-white placeholder:text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="relative group">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-400 transition-colors" />
                                <input 
                                    type={showPassword ? "text" : "password"} name="password" placeholder="Access Key" required
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-12 py-4 text-white font-mono placeholder:text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                                    onChange={handleChange}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors">
                                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                </button>
                            </div>

                            {errors.auth && <p className="text-rose-500 text-[9px] font-black uppercase tracking-widest text-center">{errors.auth}</p>}

                            <button disabled={isLoading} className="shimmer-btn w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.3em] text-[11px] rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex justify-center items-center gap-3">
                                {isLoading ? <FaSpinner className="animate-spin" /> : 'Decrypt & Enter'}
                            </button>
                        </form>

                        <div className="relative my-8 text-center">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                            <span className="relative bg-[#0b0324] px-4 text-[9px] font-black text-gray-600 uppercase tracking-widest">New Protocol?</span>
                        </div>

                        <button onClick={() => navigate('/')} className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-widest text-[10px] rounded-2xl border border-white/5 transition-all">
                            Initialize New Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;