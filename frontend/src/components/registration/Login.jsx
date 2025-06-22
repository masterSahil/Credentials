import React, { useContext, useState } from 'react'
import signInIllustration from '../../assets/imgs/loginIllu.png'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { registeredContext } from '../Context/Context';
import { AiOutlineCheckCircle, AiOutlineWarning } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';
import '../../css/toaster/toaster.css'

const Login = () => {

  const [Data, setData] = useState({
    email: '',
    password: '',
  });

  const [emailErr, setEmailErr] = useState('');
  const [passwordErr, setPasswordErr] = useState('');

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [messageType, setMessageType] = useState('');
  const [message, setMessage] = useState(false);

  const navigate = useNavigate();

  const registerContext = useContext(registeredContext);

  const URL = "https://credentials-zpxg.onrender.com/users";

  const handleChange = (e) => {
    setData(prev => ({...prev, [e.target.name]: e.target.value}));
  }

  const login = async (e) => {
    e.preventDefault();
    try { 
        if (Data.email == "" || Data.email == null) {
          setEmailErr("Email Must Be Required");
          return;
        }
        if (Data.password == "" || Data.password == null) {
          setPasswordErr("Password Must Be Required");
          return;
        }

        const res = await axios.get(URL);
        const persons = res.data.user;

        let valid = true;
        for(let p of persons)
        {
          if (p.email != Data.email) {
            setEmailErr("This Email is Invalid");
            valid = false;
          }
          else if (p.email == Data.email) {
            setEmailErr('');

            if (p.password == Data.password) {
              setPasswordErr('');
              setMessage(true);
              setMessageType("success");
              setSuccessMsg("Logged In Successfully");
              registerContext.setRegistered(true);

              setTimeout(() => {
                setMessage(false);
                navigate('/');
              }, 3000);
              localStorage.setItem("isLoggedIn", "true");
              localStorage.setItem("emailId", Data.email);
            }
            else {
              setPasswordErr("This Password is Invalid");
            }
          }
        }

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
      <div className="auth-container">
        <div className="auth-left">
          <h1>Secure Your Digital World</h1>
          <p>Login to Access your secure personal vault</p>
          <img src={signInIllustration} alt="Illustration" className="auth-image" />
        </div>

        <div className="auth-right">
          <div className="auth-box">
            <h2>Login to Account</h2>
            <form className="auth-form">
              <input type="email" placeholder="Email Address" name='email'
                value={Data.email} onChange={handleChange} />
                {emailErr && <p className='err-para'> {emailErr} </p> }

              <input type="password" placeholder="Your Password" name='password'
                value={Data.password} onChange={handleChange} />
                {passwordErr && <p className='err-para'> {passwordErr} </p> }

              <button type="submit" className="primary-btn" onClick={login}>Login</button>
            </form>

            <div className="divider">or</div>

            <button className="secondary-btn" onClick={()=>navigate('/')}>Sign Up</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login