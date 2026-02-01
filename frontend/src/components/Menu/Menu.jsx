import React, { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { registeredContext } from '../Context/Context';
import { FaBars, FaCog, FaImage, FaKey, FaLink, FaSignOutAlt } from "react-icons/fa";
import { AiOutlineCheckCircle, AiOutlineWarning } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';

const Menu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const register = useContext(registeredContext);

    const logout = () => {
        localStorage.clear();
        register.setRegistered(false);
        navigate('/');
    };

    const menuItems = [
        { name: 'Web Vault', path: '/', icon: <FaKey /> },
        { name: 'Important Links', path: '/links', icon: <FaLink /> },
        { name: 'Cloud Medias', path: '/cloud-medias', icon: <FaImage /> },
        { name: 'Settings', path: '/settings', icon: <FaCog /> },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <style>
                {`
                    .shimmer-nav {
                        position: relative; overflow: hidden;
                    }
                    .shimmer-nav::after {
                        content: ''; position: absolute; top: 0; left: -150%; width: 50%; height: 100%;
                        background: rgba(255, 255, 255, 0.1); transform: skewX(-25deg); transition: 0.7s;
                    }
                    .shimmer-nav:hover::after { left: 150%; }
                `}
            </style>

            {/* Mobile Toggle */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-5 right-5 z-[70] p-4 bg-indigo-600 text-white rounded-xl shadow-xl shadow-indigo-900/40 active:scale-95 transition-all"
            >
                {isOpen ? <IoClose size={22} /> : <FaBars size={22} />}
            </button>

            {/* Sidebar Container */}
            <aside className={`
                fixed top-0 left-0 h-screen z-50
                bg-[#0b032d] border-r border-white/5
                transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
                ${isOpen ? 'w-80 translate-x-0' : 'w-80 -translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex flex-col h-full p-8">
                    
                    {/* Branding */}
                    <div onClick={()=>{navigate('/')}} className="mb-14 cursor-pointer">
                        <h1 className="text-2xl font-black text-white tracking-widest uppercase italic">
                            Cred<span className="text-indigo-500">entials</span>
                        </h1>
                        <div className="h-1 w-12 bg-indigo-600 mt-2 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.6)]"></div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-4">
                        {menuItems.map((item) => (
                            <div
                                key={item.name}
                                onClick={() => { navigate(item.path); setIsOpen(false); }}
                                className={`
                                    shimmer-nav group flex items-center gap-4 px-5 py-4 rounded-lg cursor-pointer transition-all duration-300
                                    ${isActive(item.path) 
                                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 translate-x-2' 
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'}
                                `}
                            >
                                <span className={`text-xl transition-transform duration-300 group-hover:scale-125 ${isActive(item.path) ? 'text-white' : 'text-indigo-400'}`}>
                                    {item.icon}
                                </span>
                                <span className="font-bold text-sm tracking-wide">{item.name}</span>
                            </div>
                        ))}
                    </nav>

                    {/* Logout Section */}
                    <div className="mt-auto border-t border-white/10 pt-8">
                        <div
                            onClick={logout}
                            className="shimmer-nav group flex items-center gap-4 px-5 py-4 rounded-lg cursor-pointer bg-rose-500/5 text-rose-400 hover:bg-rose-500 hover:text-white transition-all duration-300"
                        >
                            <FaSignOutAlt className="text-xl group-hover:-translate-x-1 transition-transform" />
                            <span className="font-black uppercase tracking-[0.2em] text-[10px]">Logout</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default Menu;