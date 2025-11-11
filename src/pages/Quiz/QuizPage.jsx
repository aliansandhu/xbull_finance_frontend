import React, {useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {getNextQuizQuestion, getQuizQuestion} from "../../apis/Quiz/getQuizList";
import {quizSubmit} from "../../apis/Quiz/quizSubmit";
import {updateCourseProgress} from "../../apis/Module/courseProgress";
import {useAppContext} from "../../helpers/Context/AppContext";
import {getModuleProgress} from "../../apis/Module/moduleProgress";
import coverImage from "../../assets/images/site_background.jpeg";
import XLogo from "../../assets/images/x_logo.png";


const QuizComponent = () => {
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [quizData, setQuizData] = useState([]);
    const [congratulationsPopup, setCongratulationsPopup] = useState(false)
    const [failPopup, setFailPopup] = useState(false)
    const [attempt, setAttempt] = useState(0)
    const [quizId, setQuizId] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const navigate = useNavigate()
    const iframeRef = useRef(null);
    const { value } = useAppContext();

    const handleAnswerSelect = (questionId, option) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: option,
        }));
    };

    const param = useParams();
    const hasFetchedQuizData = useRef(false);

    useEffect(() => {
        setLoading(true)
        const getQuiz = async () => {
            try {
                const progressResponse = await getModuleProgress(param.moduleId);
                const { attempted, quiz_progress } = progressResponse.data;
                setAttempt(attempted);
                const nextQuiz = quiz_progress.find(quiz => !quiz.attempted);
                setQuizId(nextQuiz.quiz_id);
                if (attempted > 0) {
                    await fetchNextQuiz(param.moduleId);
                } else {
                    const quizResponse = await getQuizQuestion(param.moduleId);
                    setQuizData(quizResponse.data.questions);
                }
            } catch (error) {
                setLoading(false)
                console.error("Error fetching quiz data:", error);
            } finally{
                setLoading(false)
            }
        };

        if (param.moduleId && !hasFetchedQuizData.current) { // Check if data has already been fetched
            hasFetchedQuizData.current = true; // Set to true to prevent further calls
            getQuiz();
        }
        // getQuiz()
    }, [param.moduleId]);

    const fetchNextQuiz = async (moduleId, quizId) => {
        try {
            const response = await getNextQuizQuestion(moduleId);
            if(response?.data?.questions){
                setQuizData(response.data.questions);
            } else if(response?.data?.message){
                setMessage(response?.data?.message)
            }
        } catch (error) {
            console.error(`Error fetching next quiz for module ${moduleId}:`, error);
        }
    };



    useEffect(() => {
        // Dynamically create the hidden iframe
        const iframe = document.createElement("iframe");
        iframe.src = "https://shareables.clutch.co/share/badges/180145/11937?utm_source=clutch_top_company_badge&utm_medium=image_embed";
        iframe.width = "360";
        iframe.height = "360";
        iframe.style.display = "none";
        iframeRef.current = iframe;
        document.body.appendChild(iframe);
    }, []);

    const handleSubmit = async () => {
        setSubmitting(true)
        const response = await quizSubmit(param.moduleId, selectedAnswers, quizId)
        if(response.data.quiz_passed === true){
            setCongratulationsPopup(true)
            await updateCourseProgress(param.moduleId);
        } else{
            setFailPopup(true)
        }
        setSubmitting(false)
    }

    if(loading){
        return(
            <div
                role="status"
                className="flex justify-center items-center mt-48"
            >
                <svg
                    aria-hidden="true"
                    className="w-72 h-24 text-gray-200 animate-spin dark:text-white fill-blue-950"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                    />
                    <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                    />
                </svg>
                <img
                    src={XLogo}
                    alt="Static Image"
                    className="absolute w-12 h-12"
                />
                <span className="sr-only">Loading...</span>
            </div>
        )
    }

    return (
        <>
            <div style={{
                backgroundImage: `url(${coverImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}  className="relative w-full h-[400px] bg-gradient-to-r from-blue-900 via-blue-600 to-blue-900 flex flex-col items-center justify-center text-white text-center">
                <p className="bg-blue-500 py-1 px-4 rounded-md mb-2">Tier {value?.course?.tier}</p>
                <h2 className="text-3xl font-bold">DeFi Expert - {value?.course?.level}</h2>
                <p className="text-lg mt-2 px-4">{value?.course?.description}</p>
                <p className="text-lg mt-4 px-4">Attempt {attempt + 1}</p>
            </div>

            {/* ✅ Quiz Section */}
            {congratulationsPopup === false && failPopup === false ? (
                <div className="relative 2xl:w-[1000px] xl: w-[900px] md:w-[800px] sm-md:w-[500px] sm:w-[400px] mx-auto mt-[-5%] z-10 p-4">
                    {quizData?.map((question, index) => (
                        <div key={question.id} className="bg-white shadow-lg rounded-lg p-6 mb-6">
                            {/* ✅ Question Title */}
                            <p className="text-lg font-bold text-gray-800 mb-3">
                                {index + 1}. {question.text}
                            </p>

                            {/* ✅ Answer Options */}
                            <div className="space-y-3">
                                {question.options.map((option, index) => (
                                    <label
                                        key={index}
                                        className={`block p-4 border rounded-lg cursor-pointer transition-all
                                ${selectedAnswers[question.id] === option
                                            ? "bg-blue-100 border-blue-500"
                                            : "bg-white border-gray-300 hover:bg-gray-100"
                                        }`}
                                        onClick={() => handleAnswerSelect(question.id, option)}
                                    >
                                        <input
                                            type="radio"
                                            name={`quiz-${question.id}`}
                                            className="hidden"
                                            value={option}
                                        />
                                        <span className="text-gray-700 text-md">{option.text}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* ✅ Submit Button */}
                    <button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold mt-4 shadow-md"
                        onClick={handleSubmit}
                    >
                        {submitting ? 'Submitting' : 'Submit Answers'}
                    </button>
                </div>
            ) : congratulationsPopup === true && failPopup === false ? (
                <div className="w-full max-w-lg mx-auto mt-10 border border-1 bg-white rounded-lg p-6 text-center relative">
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
                        Remember to prepare before each exam because if you do not obtain a 90% score you will have to redo the module.
                    </p>

                    <div className="mt-4 items-center justify-center space-x-4">
                        <p className="text-lg mb-3 font-bold text-gray-800">
                            Ready to start new module?
                        </p>
                        <div className='space-x-3'>
                            <button
                                onClick={() => {
                                    navigate(`/course/${value?.course?.id}`);
                                }}
                                className="bg-gradient-to-r from-[#d99b2c] via-[#ae6b00] to-[#da8100] text-white font-bold py-2 px-4 rounded-md shadow-md hover:opacity-90 transition duration-300">
                                Go to Main
                            </button>
                        </div>
                    </div>
                </div>
            ) : failPopup === true && (
                <div className="w-full max-w-lg mx-auto mt-10 border border-1 bg-white rounded-lg p-6 text-center relative">
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                        <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
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
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Content */}
                    <h2 className="text-xl font-bold mt-6">Sorry!</h2>
                    <p className="text-gray-600 mt-2">
                        You didn't pass the Quiz.
                    </p>

                    <div className="mt-4 flex items-center justify-center space-x-4">
                        <p className="text-lg font-bold text-gray-800">
                            Better luck next time
                        </p>
                        <button
                            onClick={() => {
                                navigate(`/course/${value?.course?.id}`);
                            }}
                            className="bg-gradient-to-r from-[#d99b2c] via-[#ae6b00] to-[#da8100] text-white font-bold py-2 px-4 rounded-md shadow-md hover:opacity-90 transition duration-300">
                            Go to Main
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default QuizComponent;
