import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './videoProfile.css';

function VideoProfile() {

    // const handleMetaData = (e) => {
    //     const duration = e.target.duration;
    //     console.log("Duration:", duration)
    // }

    const navigate = useNavigate();


    const handleBackToGallery = () => {
        navigate('/gallery');
    }

    return (
        <div>
            <h1>This it the profile page!</h1>

            <button onClick={handleBackToGallery}>{'<'}- Back to Gallery</button>
        </div>
    );
}

export default VideoProfile;
