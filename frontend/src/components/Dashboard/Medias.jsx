import React, { useEffect, useRef, useState } from 'react'
import Menu from '../Menu/Menu'
import '../../css/Dashboard/image.css'
import axios from 'axios';
import { AiOutlineCheckCircle, AiOutlineWarning } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';
import '../../css/toaster/toaster.css';
import { useNavigate } from 'react-router-dom';

const Medias = () => {

  const [data, setData] = useState({
    image: '',
    name: null,
    desc: '',
  });

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [messageType, setMessageType] = useState('');
  const [message, setMessage] = useState(false);

  const inputRef = useRef();

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    setData(prev => ({ ...prev, [name]: type === "file" ? files[0] : value }));
  }

  const URL = "https://credentials-zpxg.onrender.com/img";

  const uniqueId = localStorage.getItem("uniqueId");

  const newData = { ...data, uniqueId };

  const upload = async (e) => {
    e.preventDefault();

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
        
        const requiredFields = { ...data };
        delete requiredFields.desc; // remove 'desc' from required fields

        const emptyField = Object.entries(requiredFields).find(
          ([key, value]) => !value || !value.toString().trim()
        );

        if (emptyField) {
          setMessage(true);
          setMessageType("error");

          if (emptyField[0] === 'image') {
            setErrorMsg(`Please select a file to upload.`);
          } else {
            setErrorMsg(`Please fill in the "${emptyField[0]}" field to store credentials.`);
          }

          setTimeout(() => {
            setMessage(false);
          }, 3000);
          return;
        }
          await axios.post(URL, newData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          });

          setMessage(true);
          setMessageType("success");
          setSuccessMsg("data added Successfully");
          setData({
            image: '',
            name: null,
            desc: '',
          })
          inputRef.current.value = null;
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
          <form method='post' className="web-creds">
            <h1>Upload Any Files</h1>

            <div className="web-creds-fields">
              <input type="file" name='image' onChange={handleChange} ref={inputRef} />
              <input type="text" placeholder='Name' name='name' className='img-sub-field'
                onChange={handleChange} value={data.name || ""} />
              <textarea name="desc" value={data.desc || ""} onChange={handleChange} placeholder='Description (optional)' className='img-sub-field' />
            </div>
            <button className='btn' onClick={upload}>Upload File</button>
          </form>

          <div className="see-creds-card">
            <div className="see-creds-text">
              <h3>Want to check your saved credentials Medias?</h3>
              <p>You can view, edit, or manage all your stored Medias Creds securely.</p>
            </div>
            <button className="see-creds-btn" onClick={() => navigate('/media-creds')}>
              Go to Media
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Medias