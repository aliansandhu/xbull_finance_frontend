import React from "react";

const NextLessonCard = ({handleLessonClick, setVideoEnded}) => {

    return (
        <div className="w-[600px] mx-auto mt-10 border border-1 bg-white rounded-lg p-6 text-center relative">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>
            </div>

            {/* Content */}
            <h2 className="text-xl font-bold mt-6">CONGRATULATIONS!</h2>
            <p className="text-gray-600 mt-2">
                You have successfully completed this lessons.
            </p>

            <div className="mt-4 items-center justify-center space-x-4">
                <p className="text-lg font-bold mb-3 text-gray-800">
                    Ready to learn next lesson?
                </p>
                <div className='space-x-3'>
                    <button
                        onClick={() => setVideoEnded(false)}
                        className="bg-backgroundPrimary cursor-pointer black font-bold py-2 px-4 rounded-md shadow-md hover:opacity-90 transition duration-300">
                        Revisit current lesson
                    </button>
                    <button
                        onClick={handleLessonClick}
                        className="bg-gradient-to-r from-[#d99b2c] via-[#ae6b00] to-[#da8100] text-white font-bold py-2 px-4 rounded-md shadow-md hover:opacity-90 transition duration-300">
                        NEXT LESSON
                    </button>
                </div>

            </div>

        </div>
    );
};

export default NextLessonCard;
