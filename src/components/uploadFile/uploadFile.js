import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import Modal from '../modal/modal';
import './uploadFile.css';

function UploadFile() {
    const [videoSrc, setVideoSrc] = useState(null);
    const [file, setFile] = useState(null);
    const [endTime, setEndTime] = useState(0);
    const [trimRange, setTrimRange] = useState([0, 0]);
    const [textInput, setTextInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const startTime = 0;

    const videoRef = useRef(null);
    // const rangeRef = useRef(null);

    const API_BASE_URL = process.env.REACT_APP_SERVICE_PORT;

    const onDrop = useCallback((acceptedFiles) => {
        console.log("counter! ");

        const file = acceptedFiles[0];
        setFile(file);
        let reader = new FileReader(); // This method is asynchronously read the contents 
        reader.readAsDataURL(file);

        reader.onprogress = () => {
            setLoading(true);
            console.log("loading...")
        }

        // setVideoSrc(reader.result);
        reader.onloadend = () => {
            setLoading(false);
            // console.log("reader.result ", reader.result);
            setVideoSrc(reader.result); // Use the base64-encoded string
        };

        setErrorMessage('');
    }, []);

    const onDropRejected = () => {
        setErrorMessage('Please upload a valid video file.');
    };

    // Drop zone handling
    const { getRootProps, getInputProps, isDragAccept } = useDropzone({
        accept: 'video/*',
        multiple: false,
        maxFiles: 1,
        onDrop,
        onDropRejected,
    });



    useEffect(() => {
        if (videoRef.current) {
            const video = videoRef.current;
            video.currentTime = trimRange[0];
            video.ontimeupdate = () => {
                if (video.currentTime > trimRange[1]) {
                    video.currentTime = trimRange[0];
                    console.log("video.currentTime: ", video.currentTime);
                }
            };
        }

    }, [trimRange]);

    const handleAddVideo = async () => {
        if (!textInput) {
            setShowModal(true);
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('video', file);
            formData.append('startTime', trimRange[0]);
            formData.append('endTime', trimRange[1]);
            formData.append('description', textInput);

            const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
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

    const handleTrimChange = (e) => {
        const value = parseFloat(e.target.value);
        const name = e.target.name;
        console.log("name): ", name)

        if (name === 'start') {
            setTrimRange([Math.min(value, trimRange[1]), trimRange[1]]);
        } else if (name === 'end') {
            setTrimRange([trimRange[0], Math.max(value, trimRange[0])]);
        }
    };

    const handleTextInput = (e) => {
        setTextInput(e.target.value);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    return (
        <div className='upload_file'>
            {/* Display changing over drag file */}
            {isDragAccept ? (<div {...getRootProps()} className='drop_zone'>
                <input {...getInputProps()} />
                <p>Drop a video here...</p>
                {errorMessage && <p className="error_message">{errorMessage}</p>}


                {/* Display ensures the file is correctly uploaded */}
            </div>) : (!videoSrc ? (
                <div {...getRootProps()} className='drop_zone'>
                    <input {...getInputProps()} />
                    <p>Drag & drop a video here, or click to select one</p>
                    {errorMessage && <p className="error_message">{errorMessage}</p>}
                </div>
            ) : (
                <div className='video_manage_container'>     {/* Display changing over video file settings */}
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
            ))}
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
