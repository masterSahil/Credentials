import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import signInIllustration from "../../assets/imgs/loginIllu.png";
import { registeredContext } from "../Context/Context";

import {
  AiOutlineCheckCircle,
  AiOutlineWarning,
} from "react-icons/ai";
import { IoClose } from "react-icons/io5";

import {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaSpinner,
} from "react-icons/fa";

const Login = () => {

  /* STATES */
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    type: "",
    msg: "",
  });

  /* SETUP */
  const navigate = useNavigate();
  const registerContext = useContext(registeredContext);

  const URL = `${import.meta.env.VITE_API_KEY}/users`;

  /* HELPERS */
  const showToast = (type, msg) => {
    setToast({ show: true, type, msg });

    setTimeout(() => {
      setToast({ show: false, type: "", msg: "" });
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setError("");

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* LOGIN */
  const login = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.get(URL);
      const users = res.data.user;
      const user = users.find((u) => u.email === form.email && u.password === form.password);

      if (!user) {
        setError("Invalid Email or Password");
        return;
      }

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("uniqueId", user.uniqueId);
      localStorage.setItem("emailId", user.email);

      registerContext.setRegistered(true);

      showToast("success", "Login Successful");

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {
      console.error(err);
      showToast("error", "Server Connection Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#06021b] flex items-center justify-center p-6 relative overflow-hidden">

      {/* TOAST */}
      {toast.show && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-3 rounded-xl border shadow-xl backdrop-blur bg-black/70
          ${
            toast.type === "success"
              ? "border-green-500 text-green-400"
              : "border-red-500 text-red-400"
          }`}
        >
          {toast.type === "success" ? (
            <AiOutlineCheckCircle size={22} />
          ) : (
            <AiOutlineWarning size={22} />
          )}

          <span className="font-semibold text-sm">
            {toast.msg}
          </span>

          <button
            onClick={() =>
              setToast({ show: false, type: "", msg: "" })
            }
          >
            <IoClose size={18} />
          </button>
        </div>
      )}

      {/* MAIN */}
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center z-10">

        {/* LEFT */}
        <div className="hidden lg:flex flex-col gap-6">
          <h1 className="text-6xl font-black text-white leading-tight">
            Access Your <br />
            <span className="text-indigo-400 italic">
              Secure Vault
            </span>
          </h1>
          <img src={signInIllustration} className="max-w-sm" alt="Login"/>
        </div>

        {/* RIGHT */}
        <div className="flex justify-center lg:justify-end">

            <div className="w-full max-w-md bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-10 shadow-2xl">

                {/* Header */}
                <div className="mb-8 text-center">
                <h2 className="text-2xl font-black text-white">
                    Sign In
                </h2>
                <p className="text-gray-500 text-xs mt-1">
                    Secure Login Required
                </p>
                </div>

                {/* FORM */}
                <form onSubmit={login} className="space-y-5" >

                {/* Email */}
                <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-12 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Password */}
                <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-12 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <button type="button" onClick={() => setShowPassword(!showPassword) }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" >
                    {showPassword ? (
                        <FaEyeSlash />
                    ) : (
                        <FaEye />
                    )}
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <p className="text-red-500 text-xs text-center font-semibold">
                    {error}
                    </p>
                )}

                {/* Button */}
                <button disabled={loading}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition flex justify-center items-center gap-2" >
                    {loading ? ( <FaSpinner className="animate-spin" /> ) : ( "Login" )}
                </button>
            </form>

            {/* Divider */}
            <div className="my-6 text-center text-gray-500 text-xs">
              or
            </div>

            {/* Signup */}
            <button
              onClick={() => navigate("/")}
              className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition text-sm"
            >
              Create New Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;