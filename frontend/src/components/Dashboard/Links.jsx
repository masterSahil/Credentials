import React, { useEffect, useState } from 'react'
import Menu from '../Menu/Menu'
import axios from 'axios';
import '../../css/Dashboard/link.css';
import '../../css/toaster/toaster.css';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AiOutlineCheckCircle, AiOutlineWarning } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';

const Links = () => {

  const [linkData, setLinkData] = useState({
    plateform: '',
    link: '',
  });

  const [linkCreds, setLinkCreds] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [messageType, setMessageType] = useState('');
  const [message, setMessage] = useState(false);

  const [loadingError, setLoadingError] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);

  const LINK_URL = "http://localhost:3000/link";
  const uniqueId = localStorage.getItem("uniqueId");

  const navigate = useNavigate();

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
        getData();

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
          window.location.reload();
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
        setLoadingError(false); setDataFetched(false);
        const res = await axios.get(LINK_URL);
        const linksData = res.data.link;

        const matchedData = [];
        for(let link of linksData)
        {
          if (link.uniqueId == uniqueId) {
            matchedData.push(link);
            setLinkCreds(matchedData);          
          }
        }
        setDataFetched(true);
    } catch (error) {
        setLoadingError(true); setDataFetched(true);
        setMessage(true);
        setMessageType("error");
        setErrorMsg("Network error. Please check your internet connection.");
        setTimeout(() => setMessage(false), 3000);
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
          
          <div className="stored-linking-creds">
              <h1>Stored Links</h1>
              <div className="stored-link-creds-content">
              {loadingError && dataFetched && <p className="media-info-msg">Network error. Please check your internet connection.</p>}
              {!loadingError && dataFetched && linkCreds.length === 0 && <p className="media-info-msg">No saved links available.</p>}
                { !loadingError && linkCreds.length > 0 && linkCreds.map((val, key) => (
                    <div className="link-cred-container" key={key}>
                      <div className="crud-opt">
                        <FaEdit title='Edit' className="icon edit-icon" onClick={() => handleEdit(val._id)} />
                        <FaTrashAlt title='Delete' className="icon delete-icon" 
                            onClick={() => handleDelete(val._id)} />
                      </div>
                      <h2 className="link-title">Platform</h2>
                      <p className="link-value">{val.plateform}</p>
                      <h2 className="link-title">Link</h2>
                      <a href={val.link} className="link-url"
                        target="_blank" rel="noopener noreferrer" >
                        {val.link}
                      </a>
                    </div>
                  ))}
              </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default Links