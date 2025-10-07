import React, { FC, ReactNode } from 'react';

// Define the Props Interface for type safety
interface PopupProps {
  /** Function to close the popup when the overlay or close button is clicked */
  onClose: () => void;
  /** The content (e.g., InviteUserSearch) to be displayed inside the popup */
  children: ReactNode;
}

const Popup: FC<PopupProps> = ({ onClose, children }) => {
    return (
        // Overlay: Fixed position, takes up the whole screen, centered content, semi-transparent black background
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 transition-opacity duration-300" 
            onClick={onClose}
        >
            {/* Content: White background, rounded corners, shadow, responsive sizing. 
                We use e.stopPropagation() to prevent clicks inside the popup from closing it. */}
            <div 
                className="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-11/12 max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 relative" 
                onClick={(e) => e.stopPropagation()}
            >
                {children}
                
                {/* Close Button (top-right corner) */}
                <button 
                    onClick={onClose} 
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                    title="Close"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
        </div>
    );
};

export default Popup;
