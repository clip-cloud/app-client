import React, { useState } from "react";

import UploadFile from "../../uploadFile/uploadFile";

import './home.css';

export default function Home() {
    const [videoFile, setVideoFile] = useState(null);


    const handleUpload = (file) => {
        setVideoFile(file);

        // const formData = new FormData();
        // formData.append('video', file);

        // axios.post('http://localhost:5000/upload', formData, {
        //     headers: {
        //         'Content-Type': 'multipart/form-data'
        //     }
        // }).then(response => {
        //     console.log('Video uploaded successfully:', response.data);
        //     // Handle the response or trigger FFmpeg processing here
        // }).catch(error => {
        //     console.error('Error uploading video:', error);
        // });
    };

    return (
        <div className="home_page">
            <div className="home_page_body">
                <span className="home_title">Hello, here you can upload some videos:</span>
                <span className="home_subtitle">subtitle</span>
            </div>

            <div className="drop_zone">
                <UploadFile onUpload={handleUpload} />
            </div>

        </div>
    );
}