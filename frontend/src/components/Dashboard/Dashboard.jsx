import React, { useEffect, useState } from 'react'
import Menu from '../Menu/Menu'
import '../../css/Dashboard/dashboard.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AiOutlineCheckCircle, AiOutlineWarning } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';
import '../../css/toaster/toaster.css'

const Dashboard = () => {
    const [userName, setUserName] = useState('');
    const [userData, setUserData] = useState({
        webName: '',
        userName: '',
        email: '',
        password: '',
    });
    
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [messageType, setMessageType] = useState('');
    const [message, setMessage] = useState(false);

    const URL_USERS = "https://credentials-zpxg.onrender.com/users";
    const URL_WEB = "https://credentials-zpxg.onrender.com/web";

    const navigate = useNavigate();

    const getData = async () => {
        try {
            const resUsers = await axios.get(URL_USERS);
            let uniqueId = localStorage.getItem("uniqueId");
            const emailId = localStorage.getItem("emailId");

            let users = resUsers.data.user;
            if (uniqueId) {
                const matchedUser = users.find(u => u.uniqueId === uniqueId);
                if (matchedUser) {
                    setUserName(matchedUser.userName);
                }
            } else if (emailId) {
                const matchedUserByEmail = users.find(u => u.email === emailId);
                if (matchedUserByEmail) {
                    setUserName(matchedUserByEmail.userName);
                    localStorage.setItem("uniqueId", matchedUserByEmail.uniqueId);
                }
            }
        } catch (error) {
            setMessage(true); setMessageType("error");
            setErrorMsg("Error fetching user or credentials data");
            setTimeout(() => setMessage(false), 3000);
        }
    };

    const submit = async () => {
        try {
            const uniqueId = localStorage.getItem("uniqueId");
            if (!uniqueId) {
                setMessage(true);
                setMessageType("error");
                setErrorMsg("User not identified. Please login again.");

                setTimeout(() => {
                    setMessage(false);
                }, 3000);
                return;
            }

            const emptyField = Object.entries(userData).find(([key, value]) => !value?.trim());

            if (emptyField) {
                setMessage(true);
                setMessageType("error");
                setErrorMsg(`Please fill in the "${emptyField[0]}" field to store credentials.`);

                setTimeout(() => {
                    setMessage(false);
                }, 3000);
                return;
            }
            const newData = { ...userData, uniqueId };
            await axios.post(URL_WEB, newData);
            setMessage(true);
            setMessageType("success");
            setSuccessMsg("Data Added Successfully");

            setTimeout(() => {
                setMessage(false);
            }, 3000);
            setUserData({
                webName: '',
                userName: '',
                email: '',
                password: '',
            });
        } catch (error) {
            setMessage(true);
            setMessageType("error");
            setErrorMsg("Something went wrong while submitting data.");

            setTimeout(() => {
                setMessage(false);
            }, 3000);
        }
    };

    const handleChange = (e) => {
        setUserData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    useEffect(() => {
        getData();
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
            <div className="credentials">
                <div className="menu-component">
                    <Menu />
                </div>

                <div className="main-content">
                    <h1>Welcome {userName || "User"}</h1>
                    <div className="web-creds">
                        <h1>Store Credentials</h1>

                        <div className="web-creds-fields">
                            <label>Website Name: </label>
                            <input type="text" name="webName" placeholder='e.g. Gmail'
                                value={userData.webName} onChange={handleChange} />
                        </div>
                        <div className="web-creds-fields">
                            <label>User Name: </label>
                            <input type="text" name="userName" placeholder='e.g. your name' 
                                value={userData.userName} onChange={handleChange} />
                        </div>
                        <div className="web-creds-fields">
                            <label>Email: </label>
                            <input type="email" name="email" placeholder='e.g. you@example.com'
                                value={userData.email} onChange={handleChange} />
                        </div>
                        <div className="web-creds-fields">
                            <label>Password: </label>
                            <input type="password" name="password" placeholder='Your Password'
                                value={userData.password} onChange={handleChange} />
                        </div>
                        <button className='btn' onClick={submit}>Save</button>
                    </div>
                    <div className="see-creds-card">
                        <div className="see-creds-text">
                            <h3>Want to check your saved credentials?</h3>
                            <p>You can view, edit, or manage all your stored website logins securely.</p>
                        </div>
                        <button className="see-creds-btn" onClick={() => navigate('/vault-creds')}>
                            Go to Vault
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
