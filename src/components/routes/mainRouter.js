import { Routes, Route } from "react-router-dom";
import React from "react";

import Home from "./home/home";
import Gallery from "./gallery/gallery";



function MainRouter() {
    return (

        <Routes>
            <Route path='/' element={<Home />} />                   {/* Home route */}
            <Route path='/gallery' element={<Gallery />} />                   {/* Home route */}
        </Routes>
    )
}

export default MainRouter;