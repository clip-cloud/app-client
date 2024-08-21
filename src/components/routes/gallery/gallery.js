import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import './gallery.css';
import axios from "axios";

export default function Gallery() {
    const [fetchVideos, setFetchVideos] = useState([]);
    const [playingIndex, setPlayingIndex] = useState(null);

    const videoRefs = useRef([]);
    const navigate = useNavigate();

    const SERVER_PORT = process.env.REACT_APP_SERVICE_PORT;

    useEffect(() => {
        // Get all videos to display on gallery
        const fetchData = async () => {
            try {
                const response = await axios.get(`${SERVER_PORT}/request/videos`);
                setFetchVideos(response.data);
                console.log("Fetching video for gallery...");
            } catch (error) {
                console.error('Error fetching videos:', error);
            }
        };

        fetchData();
    }, [SERVER_PORT]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            let firstVideoInView = null;

            entries.forEach(entry => {
                const video = entry.target;
                if (entry.isIntersecting && video.readyState >= 3) {
                    if (!firstVideoInView) {
                        firstVideoInView = video;
                    }
                }
            });

            // Inssuer that not all the videos will play together while scrolling
            videoRefs.current.forEach(video => {
                if (video && video !== firstVideoInView) {
                    video.pause();
                }
            });

            // Play the first video in view
            if (firstVideoInView && firstVideoInView !== videoRefs.current[playingIndex]) {
                firstVideoInView.play().catch(error => {
                    console.log('Autoplay was prevented:', error);
                });
                setPlayingIndex(videoRefs.current.indexOf(firstVideoInView));
            }
        }, {
            threshold: 0.9
        });

        videoRefs.current.forEach(video => {
            if (video) {
                observer.observe(video);
            }
        });

        // TODO: clearify if this functions is nessacry due to eventLister handle
        // return () => {
        //     videoRefs.current.forEach(video => {
        //         if (video) {
        //             observer.unobserve(video);
        //         }
        //     });
        // };

    }, [fetchVideos, playingIndex]);

    useEffect(() => {
        const handleVisibilityChange = () => {

            if (document.visibilityState === 'hidden') {
                // Pause all videos if the page is not visible
                videoRefs.current.forEach(video => {
                    if (video) {
                        video.pause();
                    }
                });
            }
        };

        // Triggered when the visibility changed -- visibilitychange refers to site view
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    // Remove video from gallery
    const handleRemoveVideo = async (index) => {
        const videoToRemove = fetchVideos[index];

        try {
            const response = await axios.delete(`${SERVER_PORT}/request/video/${videoToRemove._id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                // Remove the video from the state display
                const updatedVideos = fetchVideos.filter((_, i) => i !== index);
                setFetchVideos(updatedVideos);
            } else {
                console.error('Failed to remove video:', response.statusText);
            }
        } catch (error) {
            console.error('Error removing video:', error);
        }
    };

    // Navigate to the video details page
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
                            <video
                                ref={el => videoRefs.current[index] = el}
                                controls
                                loop
                                className="responsive-video"
                            >
                                <source src={`${SERVER_PORT}${video.filePath}`} type={video.format} />
                                Your browser does not support the video tag.
                            </video>
                            <button onClick={() => handleRemoveVideo(index)} className="remove_video_button">Remove</button>
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
