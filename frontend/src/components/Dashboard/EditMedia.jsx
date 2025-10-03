import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import '../../css/Dashboard/editmedia.css'
import defaultImg from '../../assets/imgs/default.png';
import filesImg from '../../assets/imgs/files.png';
import { AiOutlineCheckCircle, AiOutlineWarning } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';
import '../../css/toaster/toaster.css';
import { FaArrowLeft } from 'react-icons/fa';

const EditMedia = () => {

  const { id } = useParams();

  const [imgData, setImgData] = useState({
    name: '',
    desc: '',
    image: '',
  });

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [messageType, setMessageType] = useState('');
  const [message, setMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const URL = "https://credentials-zpxg.onrender.com/img";
  const IMAGE_URL = "https://credentials-zpxg.onrender.com/image";

  const getData = async () => {
    try {
      setLoading(true); setMessage(true); setMessageType("success");
      setSuccessMsg("Loading Your Data ...");
      const res = await axios.get(URL);
      const data = res.data.data;
      for(let img of data)
      {
        if (img._id == id) {
          setImgData(img);
        }
      }
    } catch (error) {
      setMessage(true);
      setMessageType("error");
      setErrorMsg("Error Fetching Data");

      setTimeout(() => {
        setMessage(false);
      }, 3000);
    } finally {
      setLoading(false); setMessage(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const handleChange = async (e) => {
    const { name, type, files, value } = e.target;

    if (type === "file") {
      const file = files[0];
      setImgData(prev => ({ ...prev, [name]: files[0] }));

      if (file) {
        try {
          const formData = new FormData();
          formData.append('image', file);

          setMessage(true);
          setMessageType("success");
          setSuccessMsg("File uploaded successfully!");
          setTimeout(() => setMessage(false), 3000);
          setTimeout(getData, 1200);

          await axios.put(`${IMAGE_URL}/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } catch (error) {
          setMessage(true);
          setMessageType("error");
          setErrorMsg("Upload failed: " + error.message);
          setTimeout(() => setMessage(false), 3000);
        }
      }
    } else {
      setImgData(prev => ({ ...prev, [name]: value }));
    }
  }

  const deleteImage = async () => {
    try {
      if (!imgData.image) {
      setMessage(true); setMessageType("error"); setErrorMsg("No File Exist to Delete");

      setTimeout(() => {
        setMessage(false);
      }, 3000);
        return;
      }
      await axios.delete(`${IMAGE_URL}/${id}`);

      getData();
      setMessage(true);
      setMessageType("success");
      setSuccessMsg("File Deleted Successfully");
      
      setTimeout(() => {
        setMessage(false);
        navigate('/cloud-medias');
      }, 3000);
    } catch (error) {
      setMessage(true);
      setMessageType("error");
      setErrorMsg("Error! Deleting The Data");

      setTimeout(() => {
        setMessage(false);
      }, 3000);
    }
  }

  const update = async () => {
    try {
      await axios.put(`${URL}/${id}`, imgData);
      setMessage(true);
      setMessageType("success");
      setSuccessMsg("Data Updated Successfully");

      setTimeout(() => {
        setMessage(false);
        navigate('/cloud-medias');
      }, 3000);
    } catch (error) {
      console.log(error);
      setMessage(true);
      setMessageType("error");
      setErrorMsg("Error Updating The Data");

      setTimeout(() => {
        setMessage(false);
      }, 3000);
    }
  }

  const handleDownload = async () => {
    try {
      const response = await axios.get(`https://credentials-zpxg.onrender.com/check/${id}`);

      if (response.data.exists) {
        window.location.href = `https://credentials-zpxg.onrender.com/download/${id}`;
      } else {
        setMessage(true);
        setMessageType("error");
        setErrorMsg("No file available to download.");

        setTimeout(() => setMessage(false), 3000);
      }
    } catch (err) {
      setMessage(true);
      setMessageType("error");
      setErrorMsg("Error checking file availability.");

      setTimeout(() => setMessage(false), 3000);
    }
  };


  const renderFilePreview = () => {
    const file = imgData.image;
    if (!file) return <img src={defaultImg} alt="Default" />;

    const getExt = (name) => name.split('.').pop().toLowerCase();
    const isImage = (ext) => ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
    const isVideo = (ext) => ['mp4', 'webm', 'ogg'].includes(ext);
    const isPdf = (ext) => ext === 'pdf';

    let fileURL = '', ext = '';

    if (typeof file === 'string') {
      fileURL = `https://credentials-zpxg.onrender.com/uploads/${file}`;
      ext = getExt(file);
    } else if (file && file.name && typeof file.name === 'string') 
    {
      try {
        fileURL = window.URL.createObjectURL(file);
        ext = getExt(file.name);
      } catch (e) {
        return <p>Unable to preview file</p>;
      }
    } else {
      return <p>No file to preview</p>;
    }

    if (isImage(ext)) return <img src={fileURL} alt="Preview" />;
    if (isVideo(ext)) return <video src={fileURL} controls width="100%" />;
    if (isPdf(ext)) {
      return (
        <a href={fileURL} target="_blank" rel="noopener noreferrer">
          <img src={filesImg} alt="PDF Preview" />
        </a>
      );
    }

    return (
      <a href={fileURL} target="_blank" rel="noopener noreferrer">
          <img src={filesImg} alt="PDF Preview" />
      </a>
    );
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
      <button className="back-btn" onClick={()=>navigate(-1)}>
        <FaArrowLeft style={{marginRight: '8px'}} /> Back
      </button>
     <div className="edit-media-form">
      <h2>Edit Media Profile</h2>

      <div className="edit-form-container">
        <div className="edit-image-preview">
          {renderFilePreview()}
          <div className="button-group">
              <label className="action-btn">
                Upload File
                <input type="file" name="image" onChange={handleChange} hidden />
              </label>
            </div>
        </div>
        

        <div className="edit-form-fields">
          <div className="edit-buttons">
            
            <div className="button-group">
              <button className="action-btn delete" onClick={deleteImage}>
                Delete File
              </button>
              <button className="action-btn download" onClick={handleDownload}>
                Download File
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={imgData?.name || ""}
              onChange={handleChange}
              name="name"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={imgData?.desc || ""}
              onChange={handleChange}
              name="desc"
            />
          </div>

          <button type="submit" className="update-btn" onClick={update}>
            Update
          </button>
        </div>
      </div>
    </div>
    </>
  )
}

export default EditMedia