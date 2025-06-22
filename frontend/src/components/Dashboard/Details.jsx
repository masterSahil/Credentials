import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../css/Dashboard/details.css';
import axios from 'axios';
import { AiOutlineCheckCircle, AiOutlineWarning } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';
import '../../css/toaster/toaster.css'
import { FaArrowLeft } from 'react-icons/fa';

const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [webCreds, setWebCreds] = useState({
    webName: '',
    email: '',
    password: '',
    userName: '',
  });

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [messageType, setMessageType] = useState('');
  const [message, setMessage] = useState(false);

  const URL = "http://localhost:3000/web";

  const getData = async () => {
    try {
      const res = await axios.get(URL);
      const webData = res.data.user;
      const found = webData.find(user => user._id === id);
      if (found) {
        setWebCreds({
          webName: found.webName,
          email: found.email,
          password: found.password,
          userName: found.userName,
        });
      }
    } catch (error) {
        setMessage(true);
        setMessageType("error");
        setErrorMsg(error.message);

        setTimeout(() => {
          setMessage(false);
        }, 3000);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleChange = (e) => {
    setWebCreds(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${URL}/${id}`, webCreds);
      
      setMessage(true);
      setMessageType("success");
      setSuccessMsg("Credential Updated Successfully!");
      
      setTimeout(() => {
        setMessage(false);
        navigate('/');
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
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>

      <div className="details-wrapper">
        <div className="details-form-card">
          <h2 className="details-title">📝 Edit Credential</h2>

          <div className="details-form-group">
            <label>Website Name</label>
            <input
              type="text"
              name="webName"
              value={webCreds.webName}
              onChange={handleChange}
              placeholder="Enter website name"
            />
          </div>

          <div className="details-form-group">
            <label>User Name</label>
            <input
              type="text"
              name="userName"
              value={webCreds.userName}
              onChange={handleChange}
              placeholder="Enter email"
            />
          </div>

          <div className="details-form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={webCreds.email}
              onChange={handleChange}
              placeholder="Enter email"
            />
          </div>

          <div className="details-form-group">
            <label>Password</label>
            <input
              type="text"
              name="password"
              value={webCreds.password}
              onChange={handleChange}
              placeholder="Enter password"
            />
          </div>

          <button className="update-btn" onClick={handleUpdate}>
            Update Credential
          </button>
        </div>
      </div>
    </>
  );
};

export default Details;
