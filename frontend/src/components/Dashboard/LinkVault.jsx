import React, { useEffect, useState } from 'react'
import LoaderSpinner from '../loader/loader'
import { FaEdit, FaLink, FaTrashAlt } from 'react-icons/fa';
import '../../css/toaster/toaster.css';
import '../../css/Dashboard/link.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LinkVault = () => {

    const [linkCreds, setLinkCreds] = useState([]);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [messageType, setMessageType] = useState('');
    const [message, setMessage] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingError, setLoadingError] = useState(false);
    const [link, setLink] = useState([]);

    const uniqueId = localStorage.getItem("uniqueId");
    const navigate = useNavigate();
    const LINK_URL = "https://credentials-zpxg.onrender.com/link";

    const handleEdit = (id) => {
        navigate(`/edit-cred-link/${id}`);
    }

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${LINK_URL}/${id}`);

            setMessage(true);
            setMessageType("success");
            setSuccessMsg("Credential Deleted Successfully ...");

            setTimeout(() => {
                setMessage(false);
                getData();
            }, 3000);
        } catch (error) {
            setMessage(true);
            setMessageType("error");
            setErrorMsg(error.message);

            setTimeout(() => {
                setMessage(false);
            }, 3000);
        }
    }

    const getData = async () => {
        try {
            setLoading(true); setLoadingError(false);
            const res = await axios.get(LINK_URL);
            const linksData = res.data.link;

            const matchedData = [];
            for (let link of linksData) {
                if (link.uniqueId == uniqueId) {
                    matchedData.push(link);
                    setLinkCreds(matchedData);
                }
            }
        } catch (error) {
            setLoadingError(true); 
            setMessage(true);
            setMessageType("error");
            setErrorMsg("Network error. Please check your internet connection.");
            setTimeout(() => setMessage(false), 3000);
        } finally {
            setLoading(false)
        }
    }

    const linking = (id) => {
        setLink(prev => ({...prev, [id]: !prev[id]}));
    }

    useEffect(() => {
        getData();
    }, [])

  return (
    <>
        {(message) && (
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
        <div className="stored-linking-creds">
              <h1>Stored Links</h1>
            <div className="stored-link-creds-content">
                {loading ? (
                    <div className='loading-contains'>
                    <LoaderSpinner />
                    </div>
                ) : loadingError ? (
                    <p className="media-info-msg">Network error. Please check your internet connection.</p>
                ) : linkCreds.length === 0 ? (
                    <p className="media-info-msg">No saved links available.</p>
                ) : (
                    linkCreds.map((val, key) => (
                    <div className="link-cred-container" key={key}>
                        <div className="crud-opt">
                        <FaEdit title='Edit' className="icon edit-icon" onClick={() => handleEdit(val._id)} />
                        <FaTrashAlt title='Delete' className="icon delete-icon"
                            onClick={() => handleDelete(val._id)} />
                        </div>
                        <h2 className="link-title">Platform</h2>
                        <p className="link-value">{val.plateform}</p>
                        <h2 className="link-title">Link</h2>
                        <FaLink size={16} className='linkvault-icon' onClick={()=>linking(val._id)} />
                        <a href={val.link} className="link-url" target="_blank" rel="noopener noreferrer">
                        {link[val._id] ? val.link : <span>Link</span> }  
                        </a>
                    </div>
                    ))
                )}
            </div>
        </div>
    </>
  )
}

export default LinkVault
