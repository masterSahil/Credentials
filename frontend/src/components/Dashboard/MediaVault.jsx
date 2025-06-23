import React, { useEffect, useState } from 'react'
import LoaderSpinner from '../loader/loader'
import { FaEdit, FaTrash } from 'react-icons/fa';
import '../../css/toaster/toaster.css';
import defaultImg from '../../assets/imgs/default.png';
import axios from 'axios';
import { AiOutlineCheckCircle, AiOutlineWarning } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const MediaVault = () => {

    const [loadingError, setLoadingError] = useState(false);
    const [dataFetched, setDataFetched] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [messageType, setMessageType] = useState('');
    const [message, setMessage] = useState(false);
    const [IMG, setIMG] = useState([]);

    const URL = "https://credentials-zpxg.onrender.com/img";
    const uniqueId = localStorage.getItem("uniqueId");
    const navigate = useNavigate();

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
            setErrorMsg("Error! Media Not Deleted");
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
                if (img.uniqueId === uniqueId) {
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
    <div className="media-contents">
        <h1 className="media-heading">Media Credentials</h1>
        {!dataFetched ? (
            <LoaderSpinner />
        ) : loadingError ? (
            <p className="media-info-msg">Network error. Please check your internet connection.</p>
        ) : IMG.length === 0 ? (
            <p className="media-info-msg">No uploaded files found yet.</p>
        ) : (
            <div className='media-vault-contains'>
                {IMG.map((val) => {
                    const filePath = `https://credentials-zpxg.onrender.com/uploads/${val.image}`;
                    const extension = val.image ? val.image.split('.').pop().toLowerCase() : '';
                    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension);
                    const isVideo = ['mp4', 'webm', 'ogg'].includes(extension);
                    const isPdf = extension === 'pdf';

                    return (
                        <div key={val._id} className="media-each-content">
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
                })}
            </div>
        )}
    </div>
    </>
  )
}

export default MediaVault