import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import './gallery.css';

export default function Gallery() {
    const [fetchVideos, setFetchVideos] = useState([]);
    const navigate = useNavigate();

    const SERVER_PORT = process.env.REACT_APP_SERVICE_PORT;

    useEffect(() => {
        // Get all videos to display on gallery
        const fetchData = async () => {
            try {
                const response = await fetch(`${SERVER_PORT}/request/videos`);
                const data = await response.json();
                setFetchVideos(data);
                console.log(data);
            } catch (error) {
                console.error('Error fetching videos:', error);
            }
        };

        fetchData();
    }, [SERVER_PORT]);

    // remove video from gallery
    const handleRemoveVideo = async (index) => {
        const videoToRemove = fetchVideos[index];

        try {
            const response = await fetch(`${SERVER_PORT}/request/video/${videoToRemove._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Remove the video from the state
                const updatedVideos = fetchVideos.filter((_, i) => i !== index);
                setFetchVideos(updatedVideos);
                console.log(fetchVideos);
            } else {
                console.error('Failed to remove video:', response.statusText);
            }
        } catch (error) {
            console.error('Error removing video:', error);
        }
    };

    // Navigate to the video detailes page
    const handleVideoClick = (index) => {
        const videoToShow = fetchVideos[index];
        navigate('/video/' + videoToShow._id);
    }

    return (
        <div className="gallery_header">
            <span className="gallery_title">Clips Gallery</span>
            <div className="video_list">
                {fetchVideos.length > 0 ? (
                    fetchVideos.map((video, index) => (
                        <div className="video_container" key={video._id}>
                            <video controls className="responsive-video">
                                <source src={`${SERVER_PORT}${video.filePath}`} type={video.format} />
                                Your browser does not support the video tag.
                            </video>
                            <button onClick={() => handleRemoveVideo(index)} className="video_button">Remove</button>
                            <button onClick={() => handleVideoClick(index)} className="profile_button">Details</button>
                        </div>
                    ))
                ) : (
                    <span className="empty_gallery">Your Gallery is empty, please add some clips so you can watch them here!</span>
                )}
            </div>
        </div>
    );
}
