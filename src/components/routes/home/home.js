import React, { useState } from "react";

import UploadFile from "../../uploadFile/uploadFile";

import './home.css';

export default function Home() {
    const [videoFile, setVideoFile] = useState(null);


    const handleUpload = (file) => {
        console.log("File displed")
    };

    return (
        <div className="home_page">
            <h1 className='homepage_title'>
                Choose.<br />
                Trimm. <br />
                Upload.<br />
                Watch.
            </h1>
            <div className="drop_zone_container">
                <UploadFile onUpload={handleUpload} />
            </div>

        </div>
    );
}