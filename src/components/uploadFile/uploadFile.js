import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

function UploadFile({ onUpload }) {
    const onDrop = useCallback((acceptedFiles) => {
        onUpload(acceptedFiles[0]); // Assuming a single file upload
    }, [onUpload]);

    const { getRootProps, getInputProps } = useDropzone({
        accept: 'video/*',
        multiple: false,
        onDrop,
    });

    return (
        <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '20px' }}>
            <input {...getInputProps()} />
            <p>Drag & drop a video here, or click to select one</p>
        </div>
    );
}

export default UploadFile;
