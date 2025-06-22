import React from 'react';
import '../../css/loader/loader.css'; // make sure this path is correct

const LoaderSpinner = () => {
  return (
    <div className="loader-container">
      <div className="loader"></div>
    </div>
  );
};

export default LoaderSpinner;
