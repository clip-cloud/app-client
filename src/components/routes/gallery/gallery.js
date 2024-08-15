import React, { useEffect, useState } from "react";
import './gallery.css';

export default function Gallery() {
    const [fetchVideos, setFetchVideos] = useState(null);

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
    }, []);

    return (
        <div className="gallery_header">
            <span>Video Gallery!</span>
            <div className="video_list">
                {fetchVideos ? (
                    fetchVideos.map((video, index) => (
                        <div className="video_container" key={index}>
                            <h4>{video.title}</h4>
                            {console.log("video.filePath: ", video.filePath)}
                            <video controls width="300">
                                <source src={`http://localhost:${SERVER_PORT}${video.filePath}`} type={video.format} />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    ))
                ) : (
                    <p>Loading videos...</p>
                )}
            </div>
        </div>
    );
}
