import React from 'react';
import './modal.css';

const Modal = ({ message, onClose }) => {
    return (
        <div className="modal_overlay">
            <div className="modal_content">
                <p>{message}</p>
                <button className="modal_close" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default Modal;
