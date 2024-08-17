import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './uploadFile.css';

function UploadFile({ onUpload }) {
    const [videoSrc, setVideoSrc] = useState(null);
    const [file, setFile] = useState(null);
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const [trimRange, setTrimRange] = useState([0, 0]);
    const [textInput, setTextInput] = useState(null);
    const videoRef = useRef(null);
    const rangeRef = useRef(null);

    const SERVER_PORT = process.env.REACT_APP_SERVICE_PORT;

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

    const onDrop = useCallback((acceptedFiles) => {
        onUpload(acceptedFiles[0]);
        setFile(acceptedFiles[0]);
        const file = acceptedFiles[0];
        const videoURL = URL.createObjectURL(file);
        setVideoSrc(videoURL);
    }, [onUpload]);

    const { getRootProps, getInputProps } = useDropzone({
        accept: 'video/*',
        multiple: false,
        onDrop,
    });

    const handleAddVideo = async () => {
        if (!textInput) {
            alert("Please add a description");
            return false;
        }

        try {
            const formData = new FormData();
            formData.append('video', file);
            formData.append('startTime', trimRange[0]);
            formData.append('endTime', trimRange[1]);
            formData.append('description', textInput);


            const response = await axios.post(`${SERVER_PORT}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log("HERE THE ISSUE!!")

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
        setEndTime(duration);
        setTrimRange([startTime, duration]);
    };

    const handleTrimChange = (e) => {
        const value = parseFloat(e.target.value);
        const name = e.target.name;

        if (name === 'start') {
            setTrimRange([value, trimRange[1]]);
        } else if (name === 'end') {
            setTrimRange([trimRange[0], value]);
        }
    };

    const handleTextInput = (e) => {
        setTextInput(e.target.value);
    };

    const handleCustomTimelineChange = (e) => {
        if (videoRef.current) {
            videoRef.current.currentTime = parseFloat(e.target.value);
        }
    };

    const handlePlayPause = () => {
        const video = videoRef.current;
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    };

    const handleRewind = () => {
        const video = videoRef.current;
        video.currentTime = Math.max(0, video.currentTime - 10);
    };

    const handleForward = () => {
        const video = videoRef.current;
        video.currentTime = Math.min(video.duration, video.currentTime + 10);
    };

    return (
        <div className='upload_file'>
            {!videoSrc &&
                <div {...getRootProps()}
                    style={{ border: '3px dashed #ccc', cursor: 'pointer', padding: '50px', borderRadius: '2%' }}>
                    <input {...getInputProps()} />
                    <p>Drag & drop a video here, or click to select one</p>
                </div>
            }

            {videoSrc && (
                <div>
                    <h3>Uploaded Video: {file.path}</h3>
                    <div className="video-container">
                        <video ref={videoRef} onLoadedMetadata={handleMetaData} controls={false} width="100%" height='500'>
                            <source src={videoSrc} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>

                        <div className="custom-controls">
                            <button onClick={handlePlayPause}>Play/Pause</button>
                            <input
                                type="range"
                                min={trimRange[0]}
                                max={trimRange[1]}
                                step="0.1"
                                value={videoRef.current?.currentTime || 0}
                                onChange={handleCustomTimelineChange}
                                ref={rangeRef}
                            />
                            <div className="time">
                                {videoRef.current?.currentTime.toFixed(1)}s / {endTime.toFixed(1)}s
                            </div>
                        </div>

                        <div className="vidoe_data_edit">
                            <div className="trimmer-container">
                                <label> Start Time: <input name="start"
                                    type="range"
                                    min="0"
                                    max={endTime}
                                    step="0.1"
                                    value={trimRange[0]}
                                    onChange={handleTrimChange}
                                />{trimRange[0].toFixed(1)}s </label> <br />

                                <label> End Time: <input
                                    name="end"
                                    type="range"
                                    min={trimRange[0]}
                                    max={endTime}
                                    step="0.1"
                                    value={trimRange[1]}
                                    onChange={handleTrimChange}
                                /> {trimRange[1].toFixed(1)}s
                                </label>
                            </div>

                            <div className="description_container">
                                <label className="description_label">Description<span className="mandatory">*</span>:</label>
                                <textarea
                                    onChange={handleTextInput}
                                    value={textInput}
                                    className="description_input"
                                    placeholder="Enter your text here">
                                </textarea>

                                <button className="add_button" onClick={handleAddVideo}>Upload Video</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UploadFile;
