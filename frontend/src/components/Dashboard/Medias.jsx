import React, { useEffect, useRef, useState } from 'react'
import Menu from '../Menu/Menu'
import '../../css/Dashboard/image.css'
import axios from 'axios';
import { AiOutlineCheckCircle, AiOutlineWarning } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';
import '../../css/toaster/toaster.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import defaultImg from '../../assets/imgs/default.png';
import filesImg from '../../assets/imgs/files.png';
import LoaderSpinner from '../loader/loader';

const Medias = () => {

  const [data, setData] = useState({
    image: '',
    name: null,
    desc: '',
  });

  const [IMG, setIMG] = useState([]);

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [messageType, setMessageType] = useState('');
  const [message, setMessage] = useState(false);
  const [loadingError, setLoadingError] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);

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

  const deleteMedia = async (id) => {
    try {
      await axios.delete(`${URL}/${id}`);

      setMessage(true);
      setMessageType("success");
      setSuccessMsg("Data Deleted Successfully");
      getData();

      setTimeout(() => {
        setMessage(false);
      }, 3000);
    } catch (error) {
      setMessage(true);
      setMessageType("error");
      setErrorMsg(error.message);
      setTimeout(() => { setMessage(false); }, 3000);
    }
  }

  const updateMedia = async (id) => {
    navigate(`/media-edits/${id}`);
  }

  const getData = async () => {
    try {
      setLoadingError(false);
      setDataFetched(false);
      const res = await axios.get(URL);
      const images = res.data.data;

      const anImg = [];
      for (let img of images) {
        if (img.uniqueId == uniqueId) {
          anImg.push(img);
        }
      }
      setIMG(anImg);
      setDataFetched(true);

    } catch (error) {
      setLoadingError(true);
      setDataFetched(true);
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

          <div className="media-contents">
            {!dataFetched ? (
              <LoaderSpinner />
            ) : loadingError ? (
              <p className="media-info-msg">Network error. Please check your internet connection.</p>
            ) : IMG.length === 0 ? (
              <p className="media-info-msg">No uploaded files found yet.</p>
            ) : (
              IMG.map((val, key) => {
                const filePath = `https://credentials-zpxg.onrender.com/uploads/${val.image}`;
                const extension = val.image ? val.image.split('.').pop().toLowerCase() : '';
                const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension);
                const isVideo = ['mp4', 'webm', 'ogg'].includes(extension);
                const isPdf = extension === 'pdf';

                return (
                  <div className="media-each-content" key={key}>
                    {!val.image ? (
                      <img src={defaultImg} alt="Deleted or Missing File" />
                    ) : isImage ? (
                      <img
                        src={filePath}
                        alt={val.name}
                        onError={(e) => (e.target.src = defaultImg)}
                      />
                    ) : isVideo ? (
                      <video src={filePath} controls width="100%" />
                    ) : isPdf ? (
                      <img src={filesImg} alt="PDF File" />
                    ) : (
                      <img src={filesImg} alt="Unknown File" />
                    )}

                    <h1>{val.name}</h1>
                    <p className="truncate-desc">{val.desc ? val.desc : "N/A"}</p>
                    <div className="media-icons">
                      <FaTrash className="media-delete-icons" onClick={() => deleteMedia(val._id)} />
                      <FaEdit className="media-edit-icons" onClick={() => updateMedia(val._id)} />
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      </div>
    </>
  )
}

export default Medias