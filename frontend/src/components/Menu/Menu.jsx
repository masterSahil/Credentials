import React, { useContext, useEffect, useState } from 'react'
import '../../css/Menu/menu.css'
import { useNavigate } from 'react-router-dom'
import { registeredContext } from '../Context/Context';
import { FaBars, FaCog, FaImage, FaKey, FaLink, FaSignOutAlt } from "react-icons/fa";

const Menu = () => {

    const [menu, setMenu] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 800);

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

        // If screen is large, force menu to true
        if (!mobile) {
        setMenu(true);
        }
    };

    // Initial check
    handleResize();

    // Listen for resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    }, []);

  return (
    <>
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
        </div>
    </>
  )
}

export default Menu