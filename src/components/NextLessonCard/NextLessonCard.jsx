import React from "react";

const NextLessonCard = ({handleLessonClick, setVideoEnded}) => {

    return (
        <div className="w-full max-w-[600px] mx-auto mt-6 sm:mt-10 border border-1 bg-white rounded-lg p-4 sm:p-6 text-center relative">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 text-white"
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
            <h2 className="text-lg sm:text-xl font-bold mt-4 sm:mt-6">CONGRATULATIONS!</h2>
            <p className="text-sm sm:text-base text-gray-600 mt-2 px-2">
                You have successfully completed this lessons.
            </p>

            <div className="mt-4 items-center justify-center">
                <p className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-gray-800 px-2">
                    Ready to learn next lesson?
                </p>
                <div className='flex flex-col md:flex-row gap-3 sm:gap-3 sm:space-x-3 justify-center items-stretch sm:items-center px-2'>
                    <button
                        onClick={() => setVideoEnded(false)}
                        className="w-full sm:w-auto bg-backgroundPrimary cursor-pointer black font-bold py-2 px-4 rounded-md shadow-md hover:opacity-90 transition duration-300 text-sm sm:text-base">
                        Revisit current lesson
                    </button>
                    <button
                        onClick={handleLessonClick}
                        className="w-full sm:w-auto bg-gradient-to-r from-[#d99b2c] via-[#ae6b00] to-[#da8100] text-white font-bold py-2 px-4 rounded-md shadow-md hover:opacity-90 transition duration-300 text-sm sm:text-base">
                        NEXT LESSON
                    </button>
                </div>

            </div>

        </div>
    );
};

export default NextLessonCard;
