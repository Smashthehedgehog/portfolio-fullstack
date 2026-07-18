import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import './Modal.css';

export default function Modal({ isOpen, onClose, title, children }) {
    const contentRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen) contentRef.current?.focus();
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className="modal-backdrop" onClick={onClose}>
            <div
                className="modal-content"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                tabIndex={-1}
                ref={contentRef}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    className="modal-close-btn"
                    aria-label="Close"
                    onClick={onClose}
                >
                    <FiX size={24} />
                </button>
                {title && <p id="modal-title" className="headline-2-large sonic-blue-text">{title}</p>}
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}
