import React, { useEffect, useState } from "react";
import './gallery.css';

export default function Gallery() {
    const [fetchVideos, setFetchVideos] = useState([]);

    const SERVER_PORT = process.env.REACT_APP_SERVICE_PORT;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:${SERVER_PORT}/request/videos`);
                const data = await response.json();
                setFetchVideos(data);
                console.log(data);
            } catch (error) {
                console.error('Error fetching videos:', error);
            }
        };

        fetchData();

        // console.log("fetchVideos: ", fetchVideos)

    }, [SERVER_PORT]);


    const handleRemoveVideo = async (index) => {
        const videoToRemove = fetchVideos[index];

        // console.log(" fetchVideos[index]: ", fetchVideos[index]);

        try {
            const response = await fetch(`http://localhost:${SERVER_PORT}/request/videos/${videoToRemove._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Remove the video from the state
                const updatedVideos = fetchVideos.filter((_, i) => i !== index);
                setFetchVideos(updatedVideos);
                // console.log('Video removed successfully');
                console.log(fetchVideos);
            } else {
                console.error('Failed to remove video:', response.statusText);
            }
        } catch (error) {
            console.error('Error removing video:', error);
        }
    };

    return (
        <div className="gallery_header">
            <span className="gallery_title" > Video Gallery!</span>
            <div className="video_list">
                {fetchVideos.length > 0 ? (
                    fetchVideos.map((video, index) => (
                        <div className="video_container" key={video._id}>
                            {/* <h4>{video.title}</h4> */}
                            {console.log("video._id: ", video._id)}
                            <video controls className="responsive-video " >
                                <source src={`http://localhost:${SERVER_PORT}${video.filePath}`} type={video.format} />
                                Your browser does not support the video tag.
                            </video>
                            <button onClick={() => handleRemoveVideo(index)} className="video-button">X</button>
                        </div>
                    ))
                ) : (
                    <span>Your Gallery is empty, please add some clips so you can watch them here!</span>
                )}
            </div>
        </div>
    );
}
