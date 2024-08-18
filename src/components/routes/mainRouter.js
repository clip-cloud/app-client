import { Routes, Route } from "react-router-dom";
import React from "react";

import Home from "./home/home";
import Gallery from "./gallery/gallery";
import VideoProfile from "./profile/videoProfile";


function MainRouter() {
    return (

        <Routes>
            <Route path='/' element={<Home />} />                   {/* Home route */}
            <Route path='/gallery' element={<Gallery />} />         {/* Gallery route */}

            <Route path='/video/:id' element={<VideoProfile />} /> {/* Video detailes route */}
        </Routes>
    )
}

export default MainRouter;