import React, { useEffect, useState } from 'react'
import LoaderSpinner from '../loader/loader';
import { FaEdit, FaEye, FaEyeSlash, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AiOutlineCheckCircle, AiOutlineWarning } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';
import axios from 'axios';
import '../../css/Dashboard/image.css'

const Vault = () => {
    
    const [loadingError, setLoadingError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [revealMap, setRevealMap] = useState({});
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [messageType, setMessageType] = useState('');
    const [message, setMessage] = useState(false);
    const [credData, setCredData] = useState([]);

    const URL_WEB = "https://credentials-zpxg.onrender.com/web";

    const navigate = useNavigate();

    const toggleReveal = (id) => {
        setRevealMap(prev => ({...prev, [id]: !prev[id] }));
    };

    const getData = async () => {
        try {
            setLoading(true); setLoadingError(false);

            const resWeb = await axios.get(URL_WEB);
            let uniqueId = localStorage.getItem("uniqueId");
            let allCreds = resWeb.data.user;

            if (uniqueId) {
                const filteredCreds = allCreds.filter(cred => cred.uniqueId === uniqueId);
                setCredData(filteredCreds);
            } else {
                setCredData([]);
            }
        } catch (error) {
            setLoadingError(true);
            setMessage(true);
            setMessageType("error");
            setErrorMsg("Error fetching user or credentials data");
            setTimeout(() => setMessage(false), 3000);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id) => {
        navigate(`/credential-details/${id}`);
    }
    
    const handleDelete = async (id) => {
        try {
            await axios.delete(`${URL_WEB}/${id}`);

            setMessage(true);
            setMessageType("success");
            setSuccessMsg("Deleted Successfully");
            getData();

            setTimeout(() => {
                setMessage(false);
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

    useEffect(() => {
      getData();
    }, [])
    

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
            <div className="creds">
                <h2>Your Stored Credentials</h2>

                <div className="card-creds" >
                    {loading ? (
                        <div className='loading-contains'>
                            <LoaderSpinner />
                        </div>
                    ) : loadingError ? (
                        <p className="media-info-msg">Network error. Please check your internet connection.</p>
                    ) : credData.length === 0 ? (
                        <p className="media-info-msg">No credentials stored yet.</p>
                    ) : (
                        credData.map((val, key) => (
                            <div className="sub-creds" key={key}>
                                <div className="crud-opt">
                                    <FaEdit title='Edit' className="icon edit-icon" onClick={() => handleEdit(val._id)} />
                                    <FaTrashAlt title='Delete' className="icon delete-icon" onClick={() => handleDelete(val._id)} />
                                </div>
                                <h3>Website Name</h3>
                                <p>{val.webName || "Not/Available"}</p>
                                <h3>User Name</h3>
                                <p>{val.userName || "Not/Available"}</p>
                                <h3>Email</h3>
                                <p>{val.email || "Not/Available"}</p>
                                <h3>Password</h3>
                                <p>
                                    <span className='password-span'>
                                        {revealMap[val._id] ? (
                                            <>
                                                {val.password} <FaEyeSlash onClick={() => toggleReveal(val._id)} />
                                            </>
                                        ) : (
                                            <>
                                                ******** <FaEye onClick={() => toggleReveal(val._id)} />
                                            </>
                                        )}
                                    </span>
                                </p>
                            </div>
                        ))
                    )}

                </div>
            </div>
        </>
    )
}

export default Vault