import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import CompletionCard from "../../components/CompletionCardComponent/CompletionCard";
import { getLectures } from "../../apis/Module/lectures";
import { pauseVideo } from "../../apis/Module/pauseVideo";
import { getVideoProgress } from "../../apis/Module/getVideoProgress";
import { useNavigate, useParams } from "react-router-dom";
import XLogo from "../../assets/images/x_logo.png";
import { patchModuleProgress } from "../../apis/Module/moduleProgress";
import NextLessonCard from "../../components/NextLessonCard/NextLessonCard";
import { useAppContext } from "../../helpers/Context/AppContext";

let array = []

const LessonDetail = () => {
    const [initials, setInitials] = useState({});
    const [lectures, setLectures] = useState([]);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [videoProgress, setVideoProgress] = useState({ watched_seconds: 0 });
    const [videoEnded, setVideoEnded] = useState(false);
    const [completedVideos, setCompletedVideos] = useState([]);
    const [nextLesson, setNextLesson] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [loading, setLoading] = useState(true)

    const { value } = useAppContext();

    const moduleIndex = localStorage.getItem('moduleIndex');
    const navigate = useNavigate()

    const params = useParams();
    const videoRef = useRef(null);

    const fetchedLessonsRef = useRef(new Set());

    useEffect(() => {
        setLoading(true)
        getLectures(params.moduleId).then((res) => {
            setInitials({ title: res.data.module, id: res.data.id });
            setLectures(res.data.videos);

            let completedLessons = [];

            const checkLessons = res.data.videos.map(async (lesson) => {
                const progress = await fetchVideoProgress(lesson.id);
                if (progress?.completed) {
                    completedLessons.push(lesson.id);
                }
            });

            let selectedLessonFromURL = res.data.videos.find(lesson => lesson.id === parseInt(params.lessonId));
            setSelectedLesson(selectedLessonFromURL);
            Promise.all(checkLessons).then(() => {
                if (array.length === 0) {
                    array = Array.from(completedLessons)
                    setCompletedVideos(array);

                    let lessonToFetchProgressFor;

                    if (selectedLessonFromURL) {
                        lessonToFetchProgressFor = selectedLessonFromURL.id;
                    } else {
                        let firstIncompleteLesson = res.data.videos.find(lesson => !completedLessons.includes(lesson.id));
                        lessonToFetchProgressFor = firstIncompleteLesson ? firstIncompleteLesson.id : res.data.videos[0].id;
                        setSelectedLesson(firstIncompleteLesson || res.data.videos[0]);
                    }

                    fetchVideoProgress(lessonToFetchProgressFor);
                }
            });
        }).catch((e) => {
            setLoading(false)
        }).finally(() => {
            setLoading(false)
        })
        if(selectedLesson){
            handleLessonClick(selectedLesson)
        }
    }, [params.moduleId, params.lessonId]);

    const fetchVideoProgress = async (lessonId) => {
        // if (!fetchedLessonsRef.current.has(lessonId)) {
        //     fetchedLessonsRef.current.add(lessonId);

        //     const response = await getVideoProgress(lessonId);
        //     const isCompleted = response?.data?.completed || false;
        //     setVideoProgress((prev) => ({
        //         ...prev,
        //         [lessonId]: { completed: isCompleted },
        //     }));

        //     if (isCompleted && !completedVideos.includes(lessonId)) {
        //         setCompletedVideos((prev) => [...prev, lessonId]);
        //     }

        //     return { completed: isCompleted };
        // }
        // setLoading(false)
    };


    const handleLessonClick = (lesson, index) => {
        if (selectedLesson?.id !== lesson.id) {
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
            }
    
            setSelectedLesson(lesson);
            setVideoEnded(false);
            setIsMenuOpen(!isMenuOpen);
            fetchVideoProgress(lesson.id, index);
    
            if (videoRef.current) {
                videoRef.current.src = lesson.video_file;
                videoRef.current.load();
    
                const handleLoaded = () => {
                    videoRef.current?.play().catch(err => {
                        console.log("Video play was interrupted:", err);
                    });
                    videoRef.current?.removeEventListener('loadedmetadata', handleLoaded);
                };
    
                videoRef.current.addEventListener('loadedmetadata', handleLoaded);
            }
        }
    
        navigate(`/module/${params.moduleId}/lesson/${lesson.id}`, { replace: true });
    };
    


    const handlePause = async (time) => {
        // if (selectedLesson?.id) {
        //     await pauseVideo(selectedLesson.id, false, time);
        //     setVideoProgress((prev) => ({ ...prev, watched_seconds: time }));
        // }
    };

    const handleCompleteVideo = async (e) => {
        if (!videoProgress.completed) {
            await pauseVideo(selectedLesson.id, true, e.target.currentTime);
            setVideoEnded(true);
            setCompletedVideos(prev => [...prev, selectedLesson.id]);

            const currentIndex = lectures.findIndex(lesson => lesson.id === selectedLesson.id);
            if (currentIndex !== -1 && currentIndex < lectures.length - 1) {
                setNextLesson(lectures[currentIndex + 1]);
            } else {
                setNextLesson(null);
            }
        } else {
            const currentIndex = lectures.findIndex(lesson => lesson.id === selectedLesson.id);
            if (currentIndex !== -1 && currentIndex < lectures.length - 1) {
                setNextLesson(lectures[currentIndex + 1]);
                await patchModuleProgress(params.moduleId)
            } else {
                setVideoEnded(true)
                setNextLesson(null);

            }
        }
    };

    const handleSeeking = (e) => {
        // if (videoRef.current) {
        //     const currentTime = e.target.currentTime;
        //     const lastWatched = videoProgress.watched_seconds || 0;

        //     if (currentTime > lastWatched) {
        //         videoRef.current.currentTime = lastWatched;
        //     }
        // }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setVideoProgress((prev) => ({
                ...prev,
                watched_seconds: videoRef.current.currentTime
            }));
        }
    };

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

    // useEffect(() => {
    //     const video = videoRef.current;
    //     if (!video) return;

    //     const disableSeekBar = () => {
    //         video.controls = false;
    //         video.controls = true;
    //     };

    //     video.addEventListener("loadedmetadata", disableSeekBar);
    //     video.addEventListener("seeking", handleSeeking);

    //     return () => {
    //         video.removeEventListener("loadedmetadata", disableSeekBar);
    //         video.removeEventListener("seeking", handleSeeking);
    //     };
    // }, []);

    const allCompleted = completedVideos.length === lectures.length

    if (loading) {
        return (
            <div
                role="status"
                className="flex justify-center items-center h-screen flex-1"
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

    // let url = selectedLesson?.video_file ? `${selectedLesson?.video_file}#t=${videoStartTime}` : ''
    // const isAllLessonsCompleted = lectures.length < completedVideos.length;
    return (
        <div className="bg-gray-100 h-full flex flex-col">
            <div className="flex">
                {/* Desktop View: Lesson List on the Left */}
                <div className=" md:block bg-white p-4 flex">
                    <div
                        onClick={() => navigate(`/course/${value?.course?.id}`)}
                        className="cursor-pointer flex items-center space-x-2 mb-4   "
                    >
                        <FaArrowLeft />
                        <span>Back to Tier Selection</span>
                    </div>
                    <h3 className="text-sm font-semibold px-3 py-1 w-[110px] text-white rounded">
                        MODULE {parseInt(moduleIndex) + 1}
                    </h3>

                    <h2 className="text-20 font-bold mt-2">{initials.title}</h2>
                    <ul className="mt-4 space-y-2">
                        {lectures.map((lesson, index) => {
                            const isCompleted = completedVideos.includes(lesson.id);
                            const isUnlocked = index === 0 || completedVideos.includes(lectures[index - 1].id);
                            return (
                                <div className="flex items-center space-x-3">
                                    {isCompleted ? (
                                        <FaCheckCircle className="text-[#6ace6a]" style={{ height: '15px', width: '15px', flexShrink: 0 }} />
                                    ) : (
                                        <span
                                            className={`border rounded-full flex items-center justify-center transition-all ${selectedLesson?.id === lesson.id ? "border-blue-500 bg-blue-500" : "border-gray-500 bg-white"
                                                }`}
                                            style={{
                                                width: '15px',
                                                height: '15px',
                                                flexShrink: 0,
                                            }}
                                        >
                                            {selectedLesson?.id === lesson.id && (
                                                <span
                                                    className="w-2 h-2 bg-white rounded-full"
                                                    style={{ marginLeft: '0px', marginBottom: '0.1px' }}
                                                />
                                            )}
                                        </span>
                                    )}

                                    <li
                                        key={lesson.id}
                                        className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer ${selectedLesson?.id === lesson.id ? "bg-blue-100" : "hover:bg-gray-200"
                                            }`}
                                        onClick={() => handleLessonClick(lesson, index)}
                                    >
                                        <div className="flex items-center space-x-3 w-full">
                                            <p
                                                className={`text-sm ${selectedLesson?.id === lesson.id ? "font-bold text-blue-600" : "text-gray-700"
                                                    }`}
                                                style={{
                                                    whiteSpace: 'normal',
                                                    wordBreak: 'break-word',
                                                    margin: 0,
                                                    maxWidth: 'calc(100% - 20px)',
                                                }}
                                            >
                                                {lesson.title}
                                            </p>
                                        </div>
                                    </li>
                                </div>


                            );
                        })}
                    </ul>
                </div>

                {/* Main Content Area */}
                <div className="w-full md:w-2/3 bg-[#f5f9ff] p-8">
                    <h2 className="text-24 font-bold">{selectedLesson?.title}</h2>
                    <div className="mt-4 bg-black rounded-lg relative overflow-hidden">
                        {allCompleted && !value?.quizPassed ? (
                            <div
                                className="flex items-center justify-center w-full h-72 bg-[#f5f9ff] rounded-lg flex-col">
                                <CompletionCard moduleCount={parseInt(moduleIndex) + 1} videoProgress={videoProgress} />
                            </div>
                        ) : videoEnded && !value?.quizPassed ? (
                            <div
                                className="flex items-center justify-center w-full h-72 bg-[#f5f9ff] rounded-lg flex-col">
                                {nextLesson ? (
                                    <NextLessonCard handleLessonClick={() => handleLessonClick(nextLesson)}
                                        setVideoEnded={setVideoEnded} />
                                ) : (
                                    <CompletionCard moduleCount={parseInt(moduleIndex) + 1} videoProgress={videoProgress} />
                                )}
                            </div>
                        ) : (
                            <video
                                ref={videoRef}
                                className="w-full h-auto rounded-lg"
                                controls
                                onContextMenu={(e) => e.preventDefault()}
                                preload={"auto"}
                                onTimeUpdate={handleTimeUpdate}
                                onSeeking={(e) => handleSeeking(e)}
                                disablePictureInPicture
                                controlsList="nodownload noplaybackrate nodetails"
                                onEnded={(e) => {
                                    handleCompleteVideo(e)
                                }} // ✅ Triggers video completion
                                onPause={(e) => handlePause(e.target.currentTime)}
                            >
                                {selectedLesson?.video_file ? (
                                    <source src={selectedLesson?.video_file} type="video/mp4" />
                                ) : (
                                    <p className="text-white text-center">No video available</p>
                                )}
                                Your browser does not support the video tag.
                            </video>
                        )}
                    </div>

                    {/* Lesson list below the video on mobile */}
                    <h3 className="text-sm font-semibold w-[100px] mt-10 p-1 text-white  md:hidden">
                        MODULE {parseInt(moduleIndex) + 1}
                    </h3>
                    <ul className="mt-4 space-y-2 md:hidden">
                        {lectures.map((lesson, index) => {
                            const isCompleted = completedVideos.includes(lesson.id);
                            const isUnlocked = index === 0 || completedVideos.includes(lectures[index - 1].id);
                            return (
                                <li
                                    key={lesson.id}
                                    className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer ${selectedLesson?.id === lesson.id ? "bg-blue-100" : "hover:bg-gray-200"
                                        }`}
                                    onClick={() => isUnlocked && handleLessonClick(lesson, index)}
                                >
                                    {isCompleted ? (
                                        <FaCheckCircle className="text-[#6ace6a]" />
                                    ) : (
                                        <span
                                            className={`w-4 h-4 border rounded-full flex items-center justify-center transition-all ${selectedLesson?.id === lesson.id ? "border-blue-500 bg-blue-500" : "border-gray-500 bg-white"
                                                }`}
                                        >
                                            {selectedLesson?.id === lesson.id && (
                                                <span className="w-2 h-2 bg-white rounded-full"></span>
                                            )}
                                        </span>
                                    )}
                                    <p
                                        className={`text-sm ${selectedLesson?.id === lesson.id ? "font-bold text-blue-600" : "text-gray-700"
                                            }`}
                                    >
                                        {lesson.title}
                                    </p>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default LessonDetail;