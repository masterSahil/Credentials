import React, { useContext, useEffect, useState } from 'react'
import '../../css/Menu/menu.css'
import { useNavigate } from 'react-router-dom'
import { registeredContext } from '../Context/Context';
import { FaBars, FaCog, FaImage, FaKey, FaLink, FaSignOutAlt, FaTrash } from "react-icons/fa";
import axios from 'axios';
import { AiOutlineCheckCircle, AiOutlineWarning } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';
import '../../css/toaster/toaster.css';

const Menu = () => {

    const [menu, setMenu] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 800);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [messageType, setMessageType] = useState('');
    const [message, setMessage] = useState(false);

    const navigate = useNavigate();
    const register = useContext(registeredContext);

    const logout = () =>
    {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("uniqueId")
        localStorage.removeItem("emailId")
        register.setRegistered(false);
        navigate('/');
    }

    useEffect(() => {
    const handleResize = () => {
        const mobile = window.innerWidth < 800;
        setIsMobile(mobile);

        if (!mobile) {
        setMenu(true);
        }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    }, []);

  return (
    <>
        {message && (
            <div className={`toast-msg ${messageType}`}>
                <div className="progress-bar"></div>
                <span className="icon">
                    {messageType === 'success' ? <AiOutlineCheckCircle size={24} /> : <AiOutlineWarning size={24} />}
                </span>
                <p>{messageType === 'success' ? successMsg : errorMsg}</p>
                <button className="close-btn" onClick={() => setMessage(false)}>
                    <IoClose size={22} />
                </button>
            </div>
        )}
        <div className="responsive-menu" onClick={()=>setMenu(!menu)}>
            <FaBars className="menu-icon" />
        </div>
        <div className={menu ? "menu-container" : "menu-container d-none-menu"} >
            <h1>Credentials</h1>

            <div className="sub-menus" onClick={()=>navigate('/')}>
                <h2><FaKey className='react-icons' /> Web Vault</h2>
            </div>
            <div className="sub-menus" onClick={()=>navigate('/links')}>
                <h2><FaLink className='react-icons' /> Important Links</h2>
            </div>
            <div className="sub-menus" onClick={()=>navigate('/cloud-medias')}>
                <h2><FaImage className='react-icons' /> Cloud Medias</h2>
            </div>

            <div className="sub-menus" onClick={()=>navigate('/settings')}>
                <h2><FaCog className='react-icons' /> Settings</h2>
            </div>
            <div className="sub-menus" onClick={logout}>
                <h2><FaSignOutAlt className='react-icons' />  Logout</h2>
            </div>
            {/* <div className="sub-menus" onClick={deleteAcc}>
                <h2><FaTrash className='react-icons' /> Delete Account</h2>
            </div> */}
        </div>
    </>
  )
}

export default Menu