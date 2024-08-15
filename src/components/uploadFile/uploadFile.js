import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

import './uploadFile.css';

function UploadFile({ onUpload }) {

    const [videoSrc, setVideoSrc] = useState(null);
    const [file, setFile] = useState(null);

    const SERVER_PORT = process.env.REACT_APP_SERVICE_PORT;

    const onDrop = useCallback((acceptedFiles) => {
        onUpload(acceptedFiles[0]);
        setFile(acceptedFiles[0])
        const file = acceptedFiles[0];

        const videoURL = URL.createObjectURL(file);
        setVideoSrc(videoURL); // Set the video URL in the state

        console.log(videoURL)

    }, [onUpload]);

    const { getRootProps, getInputProps } = useDropzone({
        accept: 'video/*',
        multiple: false,
        onDrop,
    });

    const handleAddVideo = async () => {
        try {

            const formData = new FormData();
            formData.append('video', file); // Assuming `file` is the video file selected

            const response = await axios.post(`http://localhost:${SERVER_PORT}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                console.log('Video uploaded successfully:', response.data.message);
                setVideoSrc(null);
            } else {
                console.error('Failed to upload video:', response.data.message);
            }
        } catch (error) {
            console.error('Error during upload:', error);
        }
    };

    const handleMetaData = (e) => {
        const duration = e.target.duration;
        console.log("Duration:", duration)
    }

    return (
        <div>
            {!videoSrc &&
                <div {...getRootProps()}
                    style={{ border: '3px dashed #ccc', cursor: 'pointer', padding: '50px', borderRadius: '2%' }}>
                    <input {...getInputProps()} />
                    <p>Drag & drop a video here, or click to select one</p>
                </div>}

            {videoSrc && (
                <div className="video-container">
                    <h3>Uploaded Video: {file.path}</h3>
                    <video onLoadedMetadata={handleMetaData} controls width="300">
                        <source src={videoSrc} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <button className="add_button" onClick={handleAddVideo}>Add</button>
                </div>
            )}
        </div>
    );
}

export default UploadFile;
