import React, { useEffect, useState } from 'react'
import Menu from '../Menu/Menu'
import axios from 'axios';
import '../../css/Dashboard/link.css';
import '../../css/toaster/toaster.css';
import { useNavigate } from 'react-router-dom';
import { AiOutlineCheckCircle, AiOutlineWarning } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';

const Links = () => {

  const [linkData, setLinkData] = useState({
    plateform: '',
    link: '',
  });

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [messageType, setMessageType] = useState('');
  const [message, setMessage] = useState(false);

  const LINK_URL = "https://credentials-zpxg.onrender.com/link";
  const uniqueId = localStorage.getItem("uniqueId");

  const navigate = useNavigate();

  const submit = async () => {
    try {
        if (!uniqueId) {
            setMessage(true);
            setMessageType("error");
            setErrorMsg("User not identified. Please login again.");

            setTimeout(() => {
                setMessage(false);
            }, 3000);
            return;
        }
        
        const emptyField = Object.entries(linkData).find(([key, value]) => !value?.trim());
        if (emptyField) {
          setMessage(true);
          setMessageType("error");
          setErrorMsg(`Please fill in the "${emptyField[0]}" field to store credentials.`);

          setTimeout(() => {
            setMessage(false);
          }, 3000);
          return;
        }

        const newData = {...linkData, uniqueId};
        await axios.post(LINK_URL, newData);

        setMessage(true);
        setMessageType("success");
        setSuccessMsg("Data Added Successfully");

        setTimeout(() => {
          setMessage(false);
        }, 3000);
        setLinkData({
          plateform: '',
          link: '',
        })
    } catch (error) {
        setMessage(true);
        setMessageType("error");
        setErrorMsg(error.message);

        setTimeout(() => {
          setMessage(false);
        }, 3000);
    }
  }

  const handleChange = (e) => {
    setLinkData(prev => ({...prev, [e.target.name]: e.target.value}));
  }
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
      <div className="credentials">
        <div className="menu-component">
          <Menu />
        </div>
        <div className="main-content">
          <div className="web-creds link-web-creds">
            <h1>Save Useful Links</h1>

            <div className="web-creds-fields">
              <label>Plateform: </label>
              <input type="text" name="plateform" placeholder='e.g. Youtube, Instagram' 
                  value={linkData.plateform} onChange={handleChange} />
            </div>
            <div className="web-creds-fields">
              <label>Video or Page Link: </label>
              <input type="text" name="link" placeholder='Paste the URL here' 
                  value={linkData.link} onChange={handleChange} />
            </div>
            <button className='btn' onClick={submit}>Save Link</button>
          </div>
          <div className="see-creds-card">
            <div className="see-creds-text">
              <h3>Want to check your saved credentials Links?</h3>
              <p>You can view, edit, or manage all your stored Link Creds.</p>
            </div>
            <button className="see-creds-btn" onClick={() => navigate('/link-creds')}>
              Go to Links
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Links
