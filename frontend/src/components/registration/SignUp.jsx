import React, { useContext, useEffect, useState } from 'react'
import '../../css/Registration/signup.css'
import signUpIllustration from '../../assets/imgs/signupillu.png'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { registeredContext, uniqueIdContext } from '../Context/Context'
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const SignUp = () => {

    const [user, setUser] = useState({
        userName: '',
        email: '',
        password: '',
    });

    const [usernameErr, setUsernameErr] = useState('');
    const [emailErr, setEmailErr] = useState('');
    const [passwordErr, setPasswordErr] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const registerContext = useContext(registeredContext);
    const contextId = useContext(uniqueIdContext);

    const handelChange = (e) =>{
        setUser(prev => ({...prev, [e.target.name]: e.target.value}))
    }

    const URL = "https://credentials-zpxg.onrender.com/users";

    const submit = async (e) => {
        e.preventDefault();
        try {
            const valid = await checkSubmit();

            if (!valid) {
                return;
            }

            const userId = await generateUniqueId();
            const newUser = { ...user, uniqueId: userId };

            await axios.post(URL, newUser);

            contextId.setMainId(userId);
            registerContext.setRegistered(true);
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("uniqueId", userId)

            setUser({
                userName: '',
                email: '',
                password: '',
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

    const generateUniqueId = async () => {
        let isUnique = false;
        let newId = '';
        const res = await axios.get(URL);
        const users = res.data.user;

        while (!isUnique) {
            newId = 'user_' + Math.random().toString(36).slice(2, 10);
            const match = users.find(user => user.uniqueId === newId);
            if (!match) {
                isUnique = true;
            }
        }

        return newId;
    };
    

    const checkSubmit = async () => {
        try {
            const res = await axios.get(URL);

            const users = res.data.user;

            if (user.userName == "" || user.userName == null) {
                setUsernameErr("Username is Required");
                return;
            }
            if (user.email == "" || user.email == null) {
                setEmailErr("Email is Required");
                return;
            }
            if (user.password == "" || user.password == null) {
                setPasswordErr("Password is Required");
                return;
            }

            for(let person of users)
            {
                if (person.userName == user.userName) {
                    setUsernameErr("This Username is Already in Use");
                    return;
                }
                if (person.email == user.email) {
                    setEmailErr("This Email is Already in Use");
                    return;
                }
            }
            return true;

        } catch (error) {
            alert(error);
        }
    }

    return (
        <>
            <div className="auth-container">
                <div className="auth-left">
                    <h1>Secure Your Digital World</h1>
                    <p>Sign up to get started with your secure personal vault</p>
                    <img src={signUpIllustration} alt="Illustration" className="auth-image" />
                </div>

                <div className="auth-right">
                    <div className="auth-box">
                        <h2>Create Account</h2>
                        <form className="auth-form">
                            <input type="text" placeholder="Full Name" name='userName'
                            value={user.userName} onChange={handelChange} />
                            {usernameErr && <p className='err-para'> {usernameErr} </p> }

                            <input type="email" placeholder="Email Address" name='email'
                            value={user.email} onChange={handelChange} />
                            {emailErr && <p className='err-para'> {emailErr} </p> }

                            <div className="password-input-wrapper">
                                <input type={showPassword ? "text" : "password"} placeholder="Create Password"
                                name="password" value={user.password} onChange={handelChange} />
                                {user.password.length > 0 && (
                                <span className="toggle-password" onClick={() => setShowPassword(!showPassword)} >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                                )}
                            </div>
                            {passwordErr && <p className='err-para'> {passwordErr} </p> }

                            <button className="primary-btn" onClick={submit}>Sign Up</button>
                        </form>

                        <div className="divider">or</div>

                        <button className="secondary-btn" onClick={() => navigate('/login')}>Sign In</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SignUp