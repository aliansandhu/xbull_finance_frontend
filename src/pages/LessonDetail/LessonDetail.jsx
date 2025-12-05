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
import { getKey } from "../../helpers/getKey";

let array = []

// Cache utility functions for completed videos
const CACHE_KEY = 'completedVideosCache';

const getCompletedVideosFromCache = () => {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        return cached ? JSON.parse(cached) : [];
    } catch (error) {
        console.error('Error reading from cache:', error);
        return [];
    }
};

const saveCompletedVideoToCache = (videoId) => {
    try {
        const cached = getCompletedVideosFromCache();
        if (!cached.includes(videoId)) {
            cached.push(videoId);
            localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
        }
    } catch (error) {
        console.error('Error saving to cache:', error);
    }
};

const isVideoCompletedInCache = (videoId) => {
    const cached = getCompletedVideosFromCache();
    return cached.includes(videoId);
};

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

    useEffect(() => {
        setLoading(true)
        const isLoggedIn = getKey();
        
        getLectures(params.moduleId).then((res) => {
            setInitials({ title: res.data.module, id: res.data.id });
            setLectures(res.data.videos);

            let completedLessons = [];

            const checkLessons = res.data.videos.map(async (lesson) => {
                if (isLoggedIn) {
                    // If logged in, check API only
                    const progress = await fetchVideoProgress(lesson.id);
                    if (progress?.completed) {
                        completedLessons.push(lesson.id);
                    }
                } else {
                    // If not logged in, check localStorage only
                    if (isVideoCompletedInCache(lesson.id)) {
                        if (!completedLessons.includes(lesson.id)) {
                            completedLessons.push(lesson.id);
                        }
                    }
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
        const isLoggedIn = getKey();
        
        if (isLoggedIn) {
            // If logged in, use API only
            try {
                const response = await getVideoProgress(lessonId);
                const isCompleted = response?.data?.completed || false;
                setVideoProgress((prev) => ({
                    ...prev,
                    completed: isCompleted,
                    watched_seconds: response?.data?.watched_seconds || 0
                }));

                if (isCompleted && !completedVideos.includes(lessonId)) {
                    setCompletedVideos((prev) => [...prev, lessonId]);
                }

                return { completed: isCompleted };
            } catch (error) {
                console.error('Error fetching video progress from API:', error);
                return { completed: false };
            }
        } else {
            // If not logged in, use localStorage only
            const isCompleted = isVideoCompletedInCache(lessonId);
            setVideoProgress((prev) => ({
                ...prev,
                completed: isCompleted,
                watched_seconds: prev.watched_seconds || 0
            }));

            if (isCompleted && !completedVideos.includes(lessonId)) {
                setCompletedVideos((prev) => [...prev, lessonId]);
            }

            return { completed: isCompleted };
        }
    };


    const handleLessonClick = async (lesson, index) => {
        const isLoggedIn = getKey();
        
        // Save current video progress before navigating
        if (selectedLesson?.id) {
            const currentVideoId = selectedLesson.id;
            const currentTime = videoRef.current?.currentTime || videoProgress.watched_seconds || 0;
            const isCompleted = videoProgress.completed || false;

            if (isLoggedIn) {
                // If logged in, save to API only
                try {
                    await pauseVideo(currentVideoId, isCompleted, currentTime);
                } catch (error) {
                    console.error('Error saving video progress to API:', error);
                    // Still continue navigation even if API fails
                }
            } else {
                // If not logged in, save to localStorage only
                if (isCompleted) {
                    saveCompletedVideoToCache(currentVideoId);
                }
            }
        }

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
        const isLoggedIn = getKey();
        
        if (!videoProgress.completed) {
            const videoId = selectedLesson.id;
            const currentTime = e.target.currentTime;
            
            // Update state immediately to show checkmark
            setVideoEnded(true);
            setVideoProgress(prev => ({
                ...prev,
                completed: true,
                watched_seconds: currentTime
            }));
            
            // Add to completedVideos if not already included
            setCompletedVideos(prev => {
                if (!prev.includes(videoId)) {
                    return [...prev, videoId];
                }
                return prev;
            });

            if (isLoggedIn) {
                // If logged in, save to API only
                try {
                    await pauseVideo(videoId, true, currentTime);
                } catch (error) {
                    console.error('Error saving video progress to API:', error);
                    // Still continue even if API fails
                }
            } else {
                // If not logged in, save to localStorage only
                saveCompletedVideoToCache(videoId);
            }

            const currentIndex = lectures.findIndex(lesson => lesson.id === videoId);
            if (currentIndex !== -1 && currentIndex < lectures.length - 1) {
                setNextLesson(lectures[currentIndex + 1]);
            } else {
                setNextLesson(null);
            }
        } else {
            const currentIndex = lectures.findIndex(lesson => lesson.id === selectedLesson.id);
            if (currentIndex !== -1 && currentIndex < lectures.length - 1) {
                setNextLesson(lectures[currentIndex + 1]);
                if (isLoggedIn) {
                    await patchModuleProgress(params.moduleId);
                }
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
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <div className="flex flex-col lg:flex-row flex-1">
                {/* Desktop View: Lesson List on the Left */}
                <div className="hidden lg:flex lg:flex-col lg:w-1/3 xl:w-1/4 bg-white shadow-sm">
                    <div className="sticky top-0 overflow-y-auto max-h-screen">
                        <div className="p-4 sm:p-6 lg:p-6 xl:p-8">
                            <div
                                onClick={() => navigate(`/course/${value?.course?.id}`)}
                                className="cursor-pointer flex items-center space-x-2 mb-6 group hover:text-blue-600 transition-colors"
                            >
                                <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
                                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">Back to Tier Selection</span>
                            </div>
                            
                            <div className="mb-4">
                                <h3 className="text-xs font-bold px-3 py-1.5 w-fit text-white rounded-md bg-gradient-to-r from-blue-600 to-blue-700 shadow-sm">
                                    MODULE {parseInt(moduleIndex) + 1}
                                </h3>
                            </div>

                            <h2 className="text-lg sm:text-xl font-bold mt-3 mb-6 text-gray-900 leading-tight">{initials.title}</h2>
                            
                            <ul className="space-y-1.5">
                                {lectures.map((lesson, index) => {
                                    const isCompleted = completedVideos.includes(lesson.id);
                                    const isUnlocked = index === 0 || completedVideos.includes(lectures[index - 1].id);
                                    return (
                                        <div key={lesson.id} className="flex items-start space-x-2.5">
                                            <div className="pt-3.5 flex-shrink-0">
                                                {isCompleted ? (
                                                    <FaCheckCircle className="text-[#6ace6a]" style={{ height: '18px', width: '18px' }} />
                                                ) : (
                                                    <span
                                                        className={`border-2 rounded-full flex items-center justify-center transition-all ${selectedLesson?.id === lesson.id ? "border-blue-500 bg-blue-500" : "border-gray-400 bg-white"
                                                            }`}
                                                        style={{
                                                            width: '18px',
                                                            height: '18px',
                                                        }}
                                                    >
                                                        {selectedLesson?.id === lesson.id && (
                                                            <span
                                                                className="w-2 h-2 bg-white rounded-full"
                                                            />
                                                        )}
                                                    </span>
                                                )}
                                            </div>

                                            <li
                                                className={`flex-1 flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                                                    selectedLesson?.id === lesson.id 
                                                        ? "bg-blue-50 border-l-4 border-blue-500 shadow-sm" 
                                                        : "hover:bg-gray-50 border-l-4 border-transparent"
                                                } ${!isUnlocked ? "opacity-50 cursor-not-allowed" : ""}`}
                                                onClick={() => isUnlocked && handleLessonClick(lesson, index)}
                                            >
                                                <p
                                                    className={`text-sm leading-relaxed ${
                                                        selectedLesson?.id === lesson.id 
                                                            ? "font-semibold text-blue-700" 
                                                            : "text-gray-700"
                                                    }`}
                                                    style={{
                                                        wordBreak: 'break-word',
                                                    }}
                                                >
                                                    {lesson.title}
                                                </p>
                                            </li>
                                        </div>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 w-full lg:w-2/3 xl:w-3/4 bg-[#f5f9ff]">
                    <div className="p-4 sm:p-6 lg:p-8">
                        {/* Mobile Header */}
                        <div className="lg:hidden mb-6">
                            <div
                                onClick={() => navigate(`/course/${value?.course?.id}`)}
                                className="cursor-pointer flex items-center space-x-2 mb-4 group"
                            >
                                <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
                                <span className="text-sm font-medium text-gray-700">Back to Tier Selection</span>
                            </div>
                            <div className="mb-3">
                                <h3 className="text-xs font-bold px-3 py-1.5 w-fit text-white rounded-md bg-gradient-to-r from-blue-600 to-blue-700 shadow-sm">
                                    MODULE {parseInt(moduleIndex) + 1}
                                </h3>
                            </div>
                            <h2 className="text-base font-semibold text-gray-600 mb-2">{initials.title}</h2>
                        </div>

                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 text-gray-900 leading-tight">
                            {selectedLesson?.title}
                        </h2>
                        
                        <div className="mt-4 bg-black rounded-xl relative overflow-hidden shadow-2xl">
                            {allCompleted && !value?.quizPassed ? (
                                <div className="flex items-center justify-center w-full min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] bg-[#f5f9ff] rounded-xl flex-col p-4">
                                    <CompletionCard moduleCount={parseInt(moduleIndex) + 1} videoProgress={videoProgress} />
                                </div>
                            ) : videoEnded && !value?.quizPassed ? (
                                <div className="flex items-center justify-center w-full min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] bg-[#f5f9ff] rounded-xl flex-col p-4">
                                    {nextLesson ? (
                                        <NextLessonCard handleLessonClick={() => handleLessonClick(nextLesson)}
                                            setVideoEnded={setVideoEnded} />
                                    ) : (
                                        <CompletionCard moduleCount={parseInt(moduleIndex) + 1} videoProgress={videoProgress} />
                                    )}
                                </div>
                            ) : (
                                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                    <video
                                        ref={videoRef}
                                        className="absolute top-0 left-0 w-full h-full rounded-lg"
                                        controls
                                        onContextMenu={(e) => e.preventDefault()}
                                        preload={"auto"}
                                        onTimeUpdate={handleTimeUpdate}
                                        onSeeking={(e) => handleSeeking(e)}
                                        disablePictureInPicture
                                        controlsList="nodownload noplaybackrate nodetails"
                                        onEnded={(e) => {
                                            handleCompleteVideo(e)
                                        }}
                                        onPause={(e) => handlePause(e.target.currentTime)}
                                    >
                                        {selectedLesson?.video_file ? (
                                            <source src={selectedLesson?.video_file} type="video/mp4" />
                                        ) : (
                                            <p className="text-white text-center">No video available</p>
                                        )}
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            )}
                        </div>

                        {/* Lesson list below the video on mobile */}
                        <div className="lg:hidden mt-8">
                            <h3 className="text-xs font-bold px-3 py-1.5 w-fit text-white rounded-md bg-gradient-to-r from-blue-600 to-blue-700 shadow-sm mb-4">
                                MODULE {parseInt(moduleIndex) + 1}
                            </h3>
                            <h2 className="text-lg font-bold mb-4 text-gray-900">{initials.title}</h2>
                            <ul className="space-y-2">
                                {lectures.map((lesson, index) => {
                                    const isCompleted = completedVideos.includes(lesson.id);
                                    const isUnlocked = index === 0 || completedVideos.includes(lectures[index - 1].id);
                                    return (
                                        <li
                                            key={lesson.id}
                                            className={`flex items-start space-x-3 p-4 rounded-lg cursor-pointer transition-all ${
                                                selectedLesson?.id === lesson.id 
                                                    ? "bg-blue-50 border-l-4 border-blue-500 shadow-sm" 
                                                    : "bg-white hover:bg-gray-50 border-l-4 border-transparent shadow-sm"
                                            } ${!isUnlocked ? "opacity-50 cursor-not-allowed" : ""}`}
                                            onClick={() => isUnlocked && handleLessonClick(lesson, index)}
                                        >
                                            <div className="pt-0.5 flex-shrink-0">
                                                {isCompleted ? (
                                                    <FaCheckCircle className="text-[#6ace6a]" style={{ height: '20px', width: '20px' }} />
                                                ) : (
                                                    <span
                                                        className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all ${
                                                            selectedLesson?.id === lesson.id 
                                                                ? "border-blue-500 bg-blue-500" 
                                                                : "border-gray-400 bg-white"
                                                        }`}
                                                    >
                                                        {selectedLesson?.id === lesson.id && (
                                                            <span className="w-2.5 h-2.5 bg-white rounded-full"></span>
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                            <p
                                                className={`text-sm leading-relaxed flex-1 ${
                                                    selectedLesson?.id === lesson.id 
                                                        ? "font-semibold text-blue-700" 
                                                        : "text-gray-700"
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
            </div>
        </div>
    );
};

export default LessonDetail;