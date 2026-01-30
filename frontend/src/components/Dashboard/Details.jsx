import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Menu from '../Menu/Menu'; // Added Menu for UI consistency
import axios from 'axios';
import { AiOutlineCheckCircle, AiOutlineWarning } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';
import { FaArrowLeft, FaEye, FaEyeSlash, FaGlobe, FaUserAlt, FaEnvelope, FaLock, FaSave } from 'react-icons/fa';

const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [webCreds, setWebCreds] = useState({
    webName: '',
    email: '',
    password: '',
    userName: '',
  });

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [messageType, setMessageType] = useState('');
  const [message, setMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const URL = `${import.meta.env.VITE_API_KEY}/web`;

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
      const webData = res.data.user;
      const found = webData.find(user => user._id === id);
      if (found) {
        setWebCreds({
          webName: found.webName,
          email: found.email,
          password: found.password,
          userName: found.userName,
        });
      }
    } catch (error) {
      triggerToast("error", "Failed to retrieve credential data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleChange = (e) => {
    setWebCreds(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${URL}/${id}`, webCreds);
      triggerToast("success", "Credential Updated Successfully!");
      setTimeout(() => navigate(-1), 2000); // Navigate back after success
    } catch (error) {
      triggerToast("error", error.message || "Update failed.");
    }
  };

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
        `}
      </style>

      {/* --- TOAST / LOADING --- */}
      {(message || loading) && (
        <div className={`fixed top-6 right-6 z-[100] flex items-center gap-4 px-6 py-5 rounded-2xl shadow-2xl border backdrop-blur-3xl animate-toast ${
          loading ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' :
          messageType === 'success' ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' : 'bg-rose-500/10 border-rose-500/50 text-rose-400'
        }`}>
          {loading ? <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div> :
          messageType === 'success' ? <AiOutlineCheckCircle size={24} /> : <AiOutlineWarning size={24} />}
          <span className="font-black uppercase tracking-widest text-[11px]">{loading ? "Synchronizing Vault..." : (messageType === 'success' ? successMsg : errorMsg)}</span>
          {!loading && <button onClick={() => setMessage(false)} className="ml-2 hover:text-white transition-colors"><IoClose size={18} /></button>}
        </div>
      )}

      <Menu />

      <main className="flex-1 lg:ml-80 p-6 md:p-12 transition-all">
        <div className="max-w-4xl mx-auto">
          
          {/* Back Button & Title */}
          <div className="mb-10 flex flex-col gap-6">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center gap-2 text-indigo-400 hover:text-white transition-colors font-bold text-sm group w-max"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Vault
            </button>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
              Edit <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent italic">Credential</span>
            </h1>
          </div>

          {/* Edit Form Card */}
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[80px] rounded-full"></div>
            
            <div className="space-y-8">
              {/* Website Name */}
              <div className="space-y-3">
                <label className="text-gray-500 text-[10px] font-black uppercase tracking-[0.25em] ml-2 flex items-center gap-2">
                  <FaGlobe className="text-indigo-500/50" /> Website / Platform
                </label>
                <input
                  type="text"
                  name="webName"
                  value={webCreds.webName}
                  onChange={handleChange}
                  placeholder="Enter website name"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                />
              </div>

              {/* Username & Email Stack */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-gray-500 text-[10px] font-black uppercase tracking-[0.25em] ml-2 flex items-center gap-2">
                    <FaUserAlt className="text-indigo-500/50" /> User Name
                  </label>
                  <input
                    type="text"
                    name="userName"
                    value={webCreds.userName}
                    onChange={handleChange}
                    placeholder="Username"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-gray-500 text-[10px] font-black uppercase tracking-[0.25em] ml-2 flex items-center gap-2">
                    <FaEnvelope className="text-indigo-500/50" /> Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={webCreds.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-3">
                <label className="text-gray-500 text-[10px] font-black uppercase tracking-[0.25em] ml-2 flex items-center gap-2">
                  <FaLock className="text-indigo-500/50" /> Access Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={webCreds.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all font-mono"
                  />
                  <button 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-400 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                </div>
              </div>

              {/* Update Button */}
              <div className="pt-6 border-t border-white/5">
                <button 
                  onClick={handleUpdate} 
                  className="shimmer-btn w-full md:w-max px-14 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.3em] text-[11px] rounded-2xl transition-all shadow-2xl shadow-indigo-600/30 active:scale-95 flex items-center justify-center gap-3"
                >
                  <FaSave size={16} /> Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Details;