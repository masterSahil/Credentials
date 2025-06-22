import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../css/Dashboard/editlink.css'
import Menu from '../Menu/Menu';
import { AiOutlineCheckCircle, AiOutlineWarning } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';
import '../../css/toaster/toaster.css'

const EditLink = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const URL = "https://credentials-zpxg.onrender.com/link";

    const [formData, setFormData] = useState({
        plateform: '',
        link: ''
    });

    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [messageType, setMessageType] = useState('');
    const [message, setMessage] = useState(false);
    const [loading, setLoading] = useState(false);

    const getData = async () => {
        try {
            setLoading(true); setMessage(true); setMessageType("success");
            setSuccessMsg("Loading Your Data ...");
            const res = await axios.get(URL);
            const linkData = res.data.link;
            const found = linkData.find(link => link._id === id);
            if (found) {
                setFormData({
                    plateform: found.plateform,
                    link: found.link
                });
            }
        } catch (error) {
            setMessage(true);
            setMessageType("error");
            setErrorMsg(error.message);

            setTimeout(() => {
                setMessage(false);
            }, 3000);
        } finally {
            setLoading(false); setMessage(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`${URL}/${id}`, formData);
            
            setMessage(true);
            setMessageType("success");
            setSuccessMsg("Link updated successfully!");
            
            setTimeout(() => {
                setMessage(false);
                navigate('/links');
            }, 3000);
        } catch (error) {
            setMessage(true);
            setMessageType("error");
            setErrorMsg(error.message);

            setTimeout(() => {
                setMessage(false);
            }, 3000);
        }
    };

    return (
        <>
            {(message || loading) && (
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
                    <Menu/>
                </div>
                <div className="edit-link-container">
                    <h2>Edit Link</h2>
                    <div className="edit-form-group">
                        <label>Platform</label>
                        <input type="text" name="plateform" value={formData.plateform}
                            onChange={handleChange} placeholder="Enter platform name"
                        />
                    </div>
                    <div className="edit-form-group">
                        <label>Link</label>
                        <input type="text" name="link" value={formData.link}
                            onChange={handleChange} placeholder="Enter the URL"
                        />
                    </div>
                    <button className="update-btn" onClick={handleUpdate}>
                        Update Link
                    </button>
                </div>
            </div>
        </>
    );
};

export default EditLink;
