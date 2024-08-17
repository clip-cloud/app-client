import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import './videoProfile.css';

function VideoProfile() {
    const [getVideoData, setVideoData] = useState({});

    const { id } = useParams();

    const navigate = useNavigate();

    const SERVER_PORT = process.env.REACT_APP_SERVICE_PORT;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:${SERVER_PORT}/request/single/video/${id}`);
                const data = await response.json();
                setVideoData(data);
                console.log(data);
            } catch (error) {
                console.error('Error fetching videos:', error);
            }
        };

        fetchData();

    }, [SERVER_PORT, id]);

    const handleBackToGallery = () => {
        navigate('/gallery');
    }

    return (
        <div className='video_profile'>
            <span>This is the profile page!</span>
            <button className='back_togallery' onClick={handleBackToGallery}>{'<'}- Back to Gallery</button>
            {getVideoData.filePath ? (
                <div className='video_profile_container'>

                    <video controls className="responsive-video-profile" >
                        <source src={`http://localhost:${SERVER_PORT}${getVideoData.filePath}`} type={getVideoData.format} />
                        Your browser does not support the video tag.
                    </video>

                    <div className='video_info'>

                        <span className='video_title_profile'>Title {getVideoData?.title} </span>
                        <span className='video_title_profile'> Date {getVideoData?.createdAt}</span>
                        <span className='video_title_profile'> Description {getVideoData?.description}</span>
                    </div>
                </div>
            )
                : (<h1>There is problem with the video profile</h1>)}

        </div>
    );
}

export default VideoProfile;
