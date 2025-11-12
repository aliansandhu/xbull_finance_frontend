import React from "react";

const NextLessonCard = ({handleLessonClick, setVideoEnded}) => {

    return (
        <div className="w-full max-w-[600px] mx-auto mt-4 sm:mt-6 lg:mt-10 border border-gray-200 bg-white rounded-xl p-4 sm:p-6 lg:p-8 text-center relative shadow-lg">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
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
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mt-6 sm:mt-8 text-gray-900">CONGRATULATIONS!</h2>
            <p className="text-sm sm:text-base text-gray-600 mt-2 sm:mt-3">
                You have successfully completed this lesson.
            </p>

            <div className="mt-6 sm:mt-8">
                <p className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-gray-800">
                    Ready to learn next lesson?
                </p>
                <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center'>
                    <button
                        onClick={() => setVideoEnded(false)}
                        className="bg-backgroundPrimary text-gray-800 font-semibold py-3 px-6 rounded-lg shadow-md hover:opacity-90 transition duration-300 text-sm sm:text-base">
                        Revisit current lesson
                    </button>
                    <button
                        onClick={handleLessonClick}
                        className="bg-gradient-to-r from-[#d99b2c] via-[#ae6b00] to-[#da8100] text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:opacity-90 transition duration-300 text-sm sm:text-base">
                        NEXT LESSON
                    </button>
                </div>
            </div>

        </div>
    );
};

export default NextLessonCard;
