import React from "react";
import UploadFile from "../../uploadFile/uploadFile";

import './home.css';

import Dropzone from "react-dropzone";

export default function Home() {




    return (
        <div className="home_page">
            <span>Hello, here you can upload some videos:</span>

            <UploadFile />
        </div>
    );
}