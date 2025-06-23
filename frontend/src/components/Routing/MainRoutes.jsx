import { useContext, useEffect, useState } from 'react'
import SignUp from '../registration/SignUp'
import Login from '../registration/Login' 

import {Route, Routes} from 'react-router-dom'
import Dashboard from '../Dashboard/Dashboard'
import Links from '../Dashboard/Links'
import Medias from '../Dashboard/Medias'
import Settings from '../Dashboard/Settings'
import { registeredContext } from '../Context/Context'
import Details from '../Dashboard/Details'
import EditLink from '../Dashboard/EditLink'
import EditMedia from '../Dashboard/EditMedia'
import Vault from '../Dashboard/Vault'
import LinkVault from '../Dashboard/LinkVault'
import MediaVault from '../Dashboard/MediaVault'

const MainRoutes = () => {
    
    const register = useContext(registeredContext);

    useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (loggedIn === "true") {
      register.setRegistered(true);
    }
  }, []);

  return (
    <>
        <Routes>
            <Route path='/' element={register.registered ? <Dashboard/>:<SignUp/> } />
            <Route path='/login' element={<Login /> } />
            <Route path='/links' element={<Links /> } />
            <Route path='/cloud-medias' element={<Medias /> } />
            <Route path='/settings' element={<Settings /> } />
            <Route path="/credential-details/:id" element={<Details />} />
            <Route path='/edit-cred-link/:id' element={<EditLink />} />
            <Route path='/media-edits/:id' element={<EditMedia />} />
            <Route path='/vault-creds' element={<Vault />} />
            <Route path='/link-creds' element={<LinkVault />} />
            <Route path='/media-creds' element={<MediaVault />} />
        </Routes>
    </>
  )
}

export default MainRoutes