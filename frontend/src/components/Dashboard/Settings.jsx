import React, { useEffect, useState } from 'react'
import Menu from '../Menu/Menu'
import '../../css/Dashboard/setting.css'
import '../../css/toaster/toaster.css'
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { AiOutlineCheckCircle, AiOutlineWarning } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';
import LoaderSpinner from '../loader/loader';

const Settings = () => {

    const [userData, setUserData] = useState({
      userName: '',
      email: '',
      password: '',
      phone: '',
      dob: '',
      gender: '',
    });

    const [pId, setPId] = useState('');
    const [visible, setVisible] = useState('');
    const [loading, setLoading] = useState(true);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [messageType, setMessageType] = useState('');
    const [message, setMessage] = useState(false);

    const id = localStorage.getItem("uniqueId");

    const URL = "https://credentials-zpxg.onrender.com/users";

    const getData = async () => {
      setLoading(true)
      setMessage(true)
      setMessageType("success");
      setSuccessMsg("Loading Your Data ...");
      try {
        const res = await axios.get(URL);

        const person = res.data.user;

        for(let p1 of person)
        {
          if (p1.uniqueId == id) {
            setUserData({
                userName: p1.userName,
                email: p1.email,
                password: p1.password,
                phone: p1.phone,
                dob: p1.dob ? new Date(p1.dob).toISOString().split('T')[0] : '',
                gender: p1.gender,
            })
            setPId(p1._id);
          }
        }
      } catch (error) {
        setMessage(true);
        setMessageType("error");
        setErrorMsg(error.message);

        setTimeout(() => {
          setMessage(false);
        }, 3000);
      } finally {
        setLoading(false);
        setMessage(false);
      }
    }

    const update = async () => {
       try {
          await axios.put(`${URL}/${pId}`, userData);

          setMessage(true);
          setMessageType("success");
          setSuccessMsg("Data Updated Successfully");

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

    const handleChange = (e) => {
      setUserData(prev => ({...prev, [e.target.name]: e.target.value}));
    }

    useEffect(() => {
      getData();
    }, [])
    

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

      <div className="credentials settings-credentials">
        <div className="menu-component setting-menu-component">
          <Menu />
        </div>
        <div className="settings">
          <h1>Update Profile</h1>
          <div className="group-field">
            <div className="setting-field">
              <label>Full Name</label>
              <input type="text" name="userName" value={userData.userName || ''} onChange={handleChange} />
            </div>
            <div className="setting-field">
              <label>Email</label>
              <input type="email" name="email" value={userData.email || ''} onChange={handleChange} />
            </div>
          </div>
          <div className="group-field">
            <div className="setting-fields">
              <label>Password</label>
              <div className="pwd-field">
                <input type={visible ? "text" : "password"}  name="password" value={userData.password || ''} onChange={handleChange}  />
                <span onClick={()=>setVisible(!visible)} className='visibiler'>
                    {visible ? <FaEyeSlash className='eye-icon' /> : <FaEye className='eye-icon' />}
                </span>
              </div>
            </div>
            <div className="setting-field">
              <label>Phone No</label>
              <input type="number" name="phone" value={userData.phone || ''} onChange={handleChange} />
            </div>
          </div>
          <div className="group-field">
            <div className="setting-field">
              <label>DOB</label>
              <input type="date" name="dob" value={userData.dob || ''} onChange={handleChange} />
            </div>
            <div className="setting-field">
              <label>Gender</label>
              <input type="text" name="gender" value={userData.gender || ''} onChange={handleChange} />
            </div>
          </div>
          <div className="setting-field">
            <button className='btn2' onClick={update}>Update Profile</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Settings