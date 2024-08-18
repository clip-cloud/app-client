import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import Modal from '../modal/modal';
import './uploadFile.css';

function UploadFile({ onUpload }) {
    const [videoSrc, setVideoSrc] = useState(null);
    const [file, setFile] = useState(null);
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const [trimRange, setTrimRange] = useState([0, 0]);
    const [textInput, setTextInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const videoRef = useRef(null);
    const rangeRef = useRef(null);

    const API_BASE_URL = process.env.REACT_APP_SERVICE_PORT;

    useEffect(() => {
        if (videoRef.current) {
            const video = videoRef.current;
            video.currentTime = trimRange[0];
            video.ontimeupdate = () => {
                if (video.currentTime > trimRange[1]) {
                    video.currentTime = trimRange[0];
                }
                if (rangeRef.current) {
                    rangeRef.current.value = video.currentTime;
                }
            };
        }
    }, [trimRange]);


    // Drop zone handaling
    const { getRootProps, getInputProps } = useDropzone({
        accept: 'video/*',
        multiple: false,
        onDrop: useCallback((acceptedFiles) => {
            onUpload(acceptedFiles[0]);
            setFile(acceptedFiles[0]);
            const file = acceptedFiles[0];
            const videoURL = URL.createObjectURL(file);
            setVideoSrc(videoURL);
        }, [onUpload]),
    });

    // Upload video onCklick
    const handleAddVideo = async () => {
        if (!textInput) {
            setShowModal(true);
            return;
        }

        setLoading(true);

        try {
            // Set data
            const formData = new FormData();
            formData.append('video', file);
            formData.append('startTime', trimRange[0]);
            formData.append('endTime', trimRange[1]);
            formData.append('description', textInput);

            const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                console.log('Video uploaded successfully:', response.data.message);
                setVideoSrc(null);
                setTextInput('');
                setFile(null);
            } else {
                console.error('Failed to upload video:', response.data.message);
            }
        } catch (error) {
            console.error('Error during upload:', error);
            alert('An error occurred during upload. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleMetaData = (e) => {
        const duration = e.target.duration;
        setEndTime(duration);
        setTrimRange([startTime, duration]);
    };

    // Set trimming
    const handleTrimChange = (e) => {
        const value = parseFloat(e.target.value);
        const name = e.target.name;

        if (name === 'start') {
            setTrimRange([Math.min(value, trimRange[1]), trimRange[1]]);
        } else if (name === 'end') {
            setTrimRange([trimRange[0], Math.max(value, trimRange[0])]);
        }
    };

    // Description handle
    const handleTextInput = (e) => {
        setTextInput(e.target.value);
    };

    // Pop up display
    const handleModalClose = () => {
        setShowModal(false);
    };

    return (
        <div className='upload_file'>
            {!videoSrc ? (
                <div {...getRootProps()} className='drop_zone'>
                    <input {...getInputProps()} />
                    <p>Drag & drop a video here, or click to select one</p>
                </div>
            ) : (
                <div className='video_manage_container'>
                    <span className='file_name'>{file?.name}</span>
                    <div className="video-container">
                        <video ref={videoRef} onLoadedMetadata={handleMetaData} controls width="100%" height="500" autoPlay loop>
                            <source src={videoSrc} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        <div className="video_data_edit">
                            <div className="trimmer_container">
                                <label>
                                    Start Time:
                                    <input
                                        name="start"
                                        type="range"
                                        min="0"
                                        max={endTime}
                                        step="0.1"
                                        value={trimRange[0]}
                                        onChange={handleTrimChange}
                                    />
                                    {trimRange[0].toFixed(1)}s
                                </label>
                                <br />
                                <label>
                                    End Time:
                                    <input
                                        name="end"
                                        type="range"
                                        min={trimRange[0]}
                                        max={endTime}
                                        step="0.1"
                                        value={trimRange[1]}
                                        onChange={handleTrimChange}
                                    />
                                    {trimRange[1].toFixed(1)}s
                                </label>
                            </div>
                            <div className="description_container">
                                <span className="description_label">
                                    Description<span className="asterix">*</span>:
                                </span>
                                <textarea
                                    onChange={handleTextInput}
                                    value={textInput}
                                    className="description_input"
                                    placeholder="Enter description for your clip"
                                ></textarea>
                                <button className="add_button" onClick={handleAddVideo}>
                                    {loading ? 'Uploading...' : 'Upload Video'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {loading && <div className="loading_spinner">Loading...</div>}
            {showModal && (
                <Modal
                    message="Please add a description before uploading your video."
                    onClose={handleModalClose}
                />
            )}
        </div>
    );
}

export default UploadFile;