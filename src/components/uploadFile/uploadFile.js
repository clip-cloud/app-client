import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

import './uploadFile.css';

function UploadFile({ onUpload }) {

    const [videoSrc, setVideoSrc] = useState(null);
    const [file, setFile] = useState(null);

    const onDrop = useCallback((acceptedFiles) => {
        onUpload(acceptedFiles[0]);
        setFile(acceptedFiles[0])
        const file = acceptedFiles[0];

        const videoURL = URL.createObjectURL(file);
        setVideoSrc(videoURL); // Set the video URL in the state

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
            console.log("Im in the onDrop func");

            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                console.log('Video uploaded successfully:', response.data.message);
            } else {
                console.error('Failed to upload video:', response.data.message);
            }
        } catch (error) {
            console.error('Error during upload:', error);
        }
    };

    return (
        <div>
            {!videoSrc &&
                <div {...getRootProps()}
                    style={{ border: '3px dashed #ccc', cursor: 'pointer', padding: '50px', borderRadius: '2%' }}>
                    <input {...getInputProps()} />
                    <p>Drag & drop a video here, or click to select one</p>
                </div>}

            {videoSrc && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Uploaded Video: {file.path} </h3>
                    <video controls width="300">
                        <source src={videoSrc} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <button className='add_button' onClick={handleAddVideo}>Add</button>
                </div>
            )}
        </div>
    );
}

export default UploadFile;
