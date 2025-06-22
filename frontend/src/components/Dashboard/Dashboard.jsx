import React, { useEffect, useState } from 'react'
import Menu from '../Menu/Menu'
import '../../css/Dashboard/dashboard.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaEye, FaEyeSlash, FaTrashAlt } from 'react-icons/fa';
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
    const [credData, setCredData] = useState([]);

    const [loadingError, setLoadingError] = useState(false);
    const [dataFetched, setDataFetched] = useState(false);
    
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [messageType, setMessageType] = useState('');
    const [message, setMessage] = useState(false);

    const [revealMap, setRevealMap] = useState({});

    const URL_USERS = "http://localhost:3000/users";
    const URL_WEB = "http://localhost:3000/web";

    const navigate = useNavigate();

    const toggleReveal = (id) => {
        setRevealMap(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };


    const getData = async () => {
        try {
            setLoadingError(false);
            setDataFetched(false);

            const resUsers = await axios.get(URL_USERS);
            const resWeb = await axios.get(URL_WEB);

            let uniqueId = localStorage.getItem("uniqueId");
            const emailId = localStorage.getItem("emailId");

            let users = resUsers.data.user;
            let allCreds = resWeb.data.user;

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

            if (uniqueId) {
                const filteredCreds = allCreds.filter(cred => cred.uniqueId === uniqueId);
                setCredData(filteredCreds);
            } else {
                setCredData([]);
            }
            setDataFetched(true);
        } catch (error) {
            setLoadingError(true);
            setDataFetched(true);
            setMessage(true);
            setMessageType("error");
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

            getData();

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

    const handleEdit = (id) => {
        navigate(`/credential-details/${id}`);
    }

    const handleDelete = async(id) => {
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

                    <div className="creds">
                        <h2>Your Stored Credentials</h2>

                        <div className="card-creds" >
                            {loadingError && dataFetched && <p className="media-info-msg">Network error. Please check your internet connection.</p>}
                            {!loadingError && dataFetched && credData.length === 0 && <p className="media-info-msg">No credentials stored yet.</p>}
                            {!loadingError && credData.length > 0 && credData.map((val, key) => (
                                <div className="sub-creds" key={key} >
                                    <div className="crud-opt">
                                        <FaEdit title='Edit' className="icon edit-icon" onClick={() => handleEdit(val._id)} />
                                        <FaTrashAlt title='Delete' className="icon delete-icon" 
                                            onClick={() => handleDelete(val._id)} />
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
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
