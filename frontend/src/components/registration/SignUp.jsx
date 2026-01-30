import React, { useContext, useEffect, useState } from 'react'
import signUpIllustration from '../../assets/imgs/signupillu.png'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { registeredContext, uniqueIdContext } from '../Context/Context'
import { FaEye, FaEyeSlash, FaUserCircle, FaEnvelope, FaLock, FaShieldAlt, FaRocket } from 'react-icons/fa';
import { AiOutlineWarning } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';

const SignUp = () => {
    const [user, setUser] = useState({
        userName: '',
        email: '',
        password: '',
    });

    const [usernameErr, setUsernameErr] = useState('');
    const [emailErr, setEmailErr] = useState('');
    const [passwordErr, setPasswordErr] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const [message, setMessage] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const navigate = useNavigate();
    const registerContext = useContext(registeredContext);
    const contextId = useContext(uniqueIdContext);

    const URL = `${import.meta.env.VITE_API_KEY}/users`;

    const triggerToast = (msg) => {
        setErrorMsg(msg);
        setMessage(true);
        setTimeout(() => setMessage(false), 3000);
    };

    const handelChange = (e) => {
        if (e.target.name === 'userName') setUsernameErr('');
        if (e.target.name === 'email') setEmailErr('');
        if (e.target.name === 'password') setPasswordErr('');
        setUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const generateUniqueId = async () => {
        let isUnique = false;
        let newId = '';
        const res = await axios.get(URL);
        const users = res.data.user;
        while (!isUnique) {
            newId = 'user_' + Math.random().toString(36).slice(2, 10);
            const match = users.find(user => user.uniqueId === newId);
            if (!match) isUnique = true;
        }
        return newId;
    };

    const checkSubmit = async () => {
        try {
            const res = await axios.get(URL);
            const users = res.data.user;
            if (!user.userName.trim()) { setUsernameErr("Username is Required"); return false; }
            if (!user.email.trim()) { setEmailErr("Email is Required"); return false; }
            if (!user.password.trim()) { setPasswordErr("Password is Required"); return false; }
            for (let person of users) {
                if (person.userName === user.userName) { setUsernameErr("Already taken"); return false; }
                if (person.email === user.email) { setEmailErr("Already registered"); return false; }
            }
            return true;
        } catch (error) {
            triggerToast("Connection failed.");
            return false;
        }
    }

    const submit = async (e) => {
        e.preventDefault();
        try {
            const valid = await checkSubmit();
            if (!valid) return;
            const userId = await generateUniqueId();
            const newUser = { ...user, uniqueId: userId };
            await axios.post(URL, newUser);
            contextId.setMainId(userId);
            registerContext.setRegistered(true);
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("uniqueId", userId);
            localStorage.setItem("emailId", user.email);
            navigate('/'); 
        } catch (error) {
            triggerToast(error.message);
        }
    }

    return (
        <div className="h-screen w-screen bg-[#06021b] flex items-center justify-center font-sans selection:bg-indigo-500/30 overflow-hidden p-4 md:p-8">
            {/* --- INLINE ANIMATIONS --- */}
            <style>
                {`
                    @keyframes fadeRight {
                        from { opacity: 0; transform: translateX(-30px); }
                        to { opacity: 1; transform: translateX(0); }
                    }
                    @keyframes fadeUp {
                        from { opacity: 0; transform: translateY(30px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes float {
                        0%, 100% { transform: translateY(0) scale(1); }
                        50% { transform: translateY(-15px) scale(1.02); }
                    }
                    .animate-fade-right { animation: fadeRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                    .animate-fade-up { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                    .animate-float { animation: float 5s ease-in-out infinite; }
                    .shimmer-btn { position: relative; overflow: hidden; }
                    .shimmer-btn::after { content: ''; position: absolute; top: 0; left: -150%; width: 50%; height: 100%; background: rgba(255, 255, 255, 0.15); transform: skewX(-25deg); transition: 0.7s; }
                    .shimmer-btn:hover::after { left: 150%; }
                `}
            </style>

            {/* --- TOAST --- */}
            {message && (
                <div className="fixed top-6 right-6 z-[100] flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-3xl animate-fade-right bg-rose-500/10 border-rose-500/50 text-rose-400">
                    <AiOutlineWarning size={24} />
                    <span className="font-bold uppercase tracking-widest text-[10px]">{errorMsg}</span>
                    <button onClick={() => setMessage(false)} className="ml-2 hover:rotate-90 transition-transform"><IoClose size={20} /></button>
                </div>
            )}

            <div className="w-full max-w-7xl h-full max-h-[800px] grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                
                {/* --- LEFT SIDE: BRANDING --- */}
                <div className="hidden lg:flex flex-col justify-center gap-8 animate-fade-right">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-full">
                            <FaRocket className="text-indigo-400 text-xs" />
                            <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">Next-Gen Security</span>
                        </div>
                        <h1 className="text-6xl xl:text-7xl font-black text-white tracking-tighter leading-[0.9]">
                            Secure Your <br />
                            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent italic">Digital World</span>
                        </h1>
                        <p className="text-gray-500 text-lg font-medium tracking-wide max-w-sm border-l-2 border-indigo-500/30 pl-4 mt-4">
                            Join our elite vault network to encrypt and manage your most sensitive data.
                        </p>
                    </div>

                    <div className="relative w-full max-w-md">
                        <div className="absolute inset-0 bg-indigo-600/20 blur-[100px] rounded-full"></div>
                        <img src={signUpIllustration} alt="Security" className="relative w-full animate-float z-10" />
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
                            <FaShieldAlt className="text-indigo-500" />
                            <span className="text-white font-bold text-[10px] tracking-[0.2em] uppercase">Enterprise Grade</span>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT SIDE: FORM --- */}
                <div className="flex items-center justify-center animate-fade-up">
                    <div className="w-full max-w-[420px] bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 xl:p-12 shadow-2xl relative overflow-hidden">
                        {/* Decorative glow */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/20 blur-[60px] rounded-full"></div>
                        
                        <header className="mb-8 text-center">
                            <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em]">Create Account</h2>
                            <p className="text-gray-500 font-bold text-[10px] mt-2 uppercase tracking-widest">Initialize your secure instance</p>
                        </header>

                        <form className="space-y-5" onSubmit={submit}>
                            <div className="space-y-1">
                                <div className="relative group">
                                    <input 
                                        type="text" placeholder="Full Name" name='userName'
                                        value={user.userName} onChange={handelChange}
                                        className={`w-full bg-white/5 border ${usernameErr ? 'border-rose-500/50' : 'border-white/10'} group-hover:border-white/20 rounded-2xl px-12 py-4 text-white text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all placeholder:text-gray-700`}
                                    />
                                    <FaUserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                                </div>
                                {usernameErr && <p className="text-rose-500 text-[9px] font-black uppercase tracking-widest ml-2">{usernameErr}</p>}
                            </div>

                            <div className="space-y-1">
                                <div className="relative group">
                                    <input 
                                        type="email" placeholder="Email Address" name='email'
                                        value={user.email} onChange={handelChange}
                                        className={`w-full bg-white/5 border ${emailErr ? 'border-rose-500/50' : 'border-white/10'} group-hover:border-white/20 rounded-2xl px-12 py-4 text-white text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all placeholder:text-gray-700`}
                                    />
                                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-400 transition-colors" size={16} />
                                </div>
                                {emailErr && <p className="text-rose-500 text-[9px] font-black uppercase tracking-widest ml-2">{emailErr}</p>}
                            </div>

                            <div className="space-y-1">
                                <div className="relative group">
                                    <input 
                                        type={showPassword ? "text" : "password"} placeholder="Access Key"
                                        name="password" value={user.password} onChange={handelChange}
                                        className={`w-full bg-white/5 border ${passwordErr ? 'border-rose-500/50' : 'border-white/10'} group-hover:border-white/20 rounded-2xl px-12 py-4 text-white text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all font-mono placeholder:text-gray-700`}
                                    />
                                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-400 transition-colors" size={16} />
                                    {user.password.length > 0 && (
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors">
                                            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                        </button>
                                    )}
                                </div>
                                {passwordErr && <p className="text-rose-500 text-[9px] font-black uppercase tracking-widest ml-2">{passwordErr}</p>}
                            </div>

                            <button className="shimmer-btn w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.3em] text-[11px] rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98]">
                                Authorize Sign Up
                            </button>
                        </form>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                            <div className="relative flex justify-center text-[9px] font-black uppercase tracking-widest"><span className="bg-[#0b0324] px-4 text-gray-600 italic">Established User?</span></div>
                        </div>

                        <button onClick={() => navigate('/login')} className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl border border-white/5 transition-all active:scale-[0.98]">
                            Sign In to Vault
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp