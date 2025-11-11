import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaPen, FaYoutube } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { getModules } from "../../apis/Module/module";
import { getModuleProgress } from "../../apis/Module/moduleProgress";
import { useAppContext } from "../../helpers/Context/AppContext";
import { toast } from "react-toastify";
import { saveAs } from 'file-saver';
import XLogo from "../../assets/images/x_logo.png";
import coverImage from '../../assets/images/site_background.jpeg';
import ApprenticeImage from '../../assets/images/Apprentice.png'
import ExpertImage from '../../assets/images/Expert.png'
import MasterImage from '../../assets/images/Master.png'
import { getKey } from "../../helpers/getKey";
import Modal from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import FooterLogo from '../../assets/images/XbullFooter.png'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaCheck, FaTimes } from "react-icons/fa";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import { userRegister, userSignup } from "../../apis/Authentication/signup";
import icon from "../../assets/images/updatedLogo.png";
import { setKey } from "../../helpers/setKey";
import { userLogin } from "../../apis/Authentication/login";


const PasswordRequirement = ({ isValid, text }) => (
    <div className="flex mt-3">
        {isValid ? (
            <FaCheck className="text-greenGradient mt-1 mr-2" />
        ) : (
            <FaTimes className="mt-1 mr-2" style={{ color: "red" }} />
        )}
        <p>{text}</p>
    </div>
);

const ModulePage = () => {
    const params = useParams();
    const navigate = useNavigate();
    const fetchedModulesRef = useRef(new Set());
    const hasFetchedData = useRef(false);

    const [modules, setModules] = useState([]);
    const [moduleProgressMap, setModuleProgressMap] = useState({});
    const [signupModal, setSignupModal] = useState(false)
    const [loginModal, setLoginModal] = useState(false)
    const [moduleId, setModuleId] = useState(null)
    const [lesson, setLesson] = useState([])
    const [loading, setLoading] = useState(true)

    const { value, setValue } = useAppContext();

    const badge = value?.course?.course_badge || ''

    useEffect(() => {
        if (params.id && !hasFetchedData.current) {
            setLoading(true)
            hasFetchedData.current = true;

            getModules(params.id).then((res) => {
                setModules(res.data);

                const newLessons = [];
                res.data.forEach((module) => {
                    fetchModuleProgress(module.id);

                    module.lessons.forEach((subItem) => {
                        newLessons.push({
                            moduleId: module.id,
                            id: subItem[1],
                            text: subItem[0]
                        });
                    });
                });

                setLesson(newLessons);
            }).catch((e) => {
                setLoading(false)
            }).finally(() => {
                setLoading(false)
            })
        }
    }, [params.id]);


    const fetchModuleProgress = (moduleId) => {
        if (!fetchedModulesRef.current.has(moduleId)) {
            fetchedModulesRef.current.add(moduleId);

            getModuleProgress(moduleId)
                .then((res) => {
                    const videoCompletionStatus = res.data.videos?.map(video => ({
                        video_id: video.video_id,
                        completed: video.completed,
                        total_watched: res?.data?.total_watched,
                        total_videos: res?.data?.total_videos,
                    })) || [];

                    setModuleProgressMap((prev) => ({
                        ...prev,
                        [moduleId]: {
                            video_completed: res.data?.video_completed || false,
                            quiz_passed: res.data?.quiz_passed || false,
                            videos: videoCompletionStatus,
                            progress_percentage: res?.data?.progress_percentage
                        }
                    }));
                    setLoading(false)
                })
                .catch((error) => {
                    console.error(`Error fetching progress for module ${moduleId}:`, error);
                });
        }
    };

    const allQuizzesPassed = Object.values(moduleProgressMap).every(module => module.quiz_passed);


    const handleStart = (moduleId, lessonId, index, quizPassed) => {
            localStorage.setItem('moduleIndex', index)
            setValue((prev) => ({
                ...prev,
                quizPassed: quizPassed
            }))
            navigate(`/module/${moduleId}/lesson/${lessonId}`);
        // }
    };

    const handleDownload = async () => {
        try {
            const response = await fetch(badge);
            if (!response.ok) throw new Error('Network response was not ok');

            const blob = await response.blob();
            saveAs(blob, 'Apprentice_Badge_Round_2.png');
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [err, setErr] = useState("");

    // ✅ Yup Validation Schema
    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Please enter a valid email address.")
            .required("Email is required."),
        password: Yup.string()
            .required("Password is required.")
            .min(8, "Password must be at least 8 characters.")
            .matches(/[A-Z]/, "Password must contain at least one uppercase letter.")
            .matches(/[a-z]/, "Password must contain at least one lowercase letter.")
            .matches(/[0-9]/, "Password must contain at least one number.")
            .matches(/[!@#$%^&*]/, "Password must contain at least one special character."),
        confirm_password: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords must match.")
            .required("Please confirm your password."),
    });

    const validationSchemaLogin = Yup.object({
        email: Yup.string()
            .email("Please enter a valid email address.")
            .required("Email is required."),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
    });

    // ✅ Formik Setup
    const formik = useFormik({
        initialValues: {
            email: "",
            first_name: "",
            last_name: "",
            xhandle: "",
            password: "",
            confirm_password: "",
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting, setErrors, resetForm }) => {
            try {
                const response = await userRegister(
                    values.email,
                    values.password,
                    values.confirm_password
                );



                if (response.status === 201) {
                    setKey(response.data.access_token)
                    setSignupModal(false)
                    setValue((prev) => ({
                        ...prev,
                        user: response?.data?.user
                    }))
                    navigate(`/exam/${moduleId}`);
                    // window.location.reload()
                } else {
                    setErr(response.message.charAt(0).toUpperCase() + response.message.slice(1));
                }
            } catch (error) {
                toast.error("An error occurred during signup. Please try again.");
            } finally {
                setSubmitting(false)
            }
        },
    });

    const formikLogin = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchemaLogin,
        onSubmit: async (values, { setSubmitting, setErrors, resetForm }) => {
            try {
                const response = await userLogin(
                    values.email,
                    values.password,
                );

                if (response.status === 200) {
                    setKey(response.data.token)
                    setLoginModal(false)
                    setValue((prev) => ({
                        ...prev,
                        user: response?.data?.user
                    }))
                    navigate(`/exam/${moduleId}`);
                    // window.location.reload()
                } else {
                    setErr(response.message.charAt(0).toUpperCase() + response.message.slice(1));
                }
            } catch (error) {
                toast.error("An error occurred during signup. Please try again.");
            } finally {
                setSubmitting(false)
            }
        },
    });

    // ✅ Password validation visualization
    const password = formik.values.password;
    const passwordCriteria = {
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasSpecialChar: /[!@#$%^&*]/.test(password),
        hasNumber: /\d/.test(password),
        matches: password === formik.values.confirm_password,
    };

    if (loading) {
        return (
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
        <div className="bg-[#f5f9ff] min-h-screen ">
            {/* ✅ Header */}
            <div
                style={{
                    backgroundImage: `url(${coverImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
                className="relative w-full h-[400px] sm:h-[450px] md:h-[500px] bg-gradient-to-r from-blue-900 via-blue-600 to-blue-900 flex flex-col items-center justify-center text-white text-center px-4"
            >
                {/* Tier Tag */}
                <p className="bg-blue-500 py-1 px-4 rounded-md text-sm sm:text-base mt-24 sm:mt-36">
                    {`Tier ${value?.course?.tier}`}
                </p>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-4">
                    {`DeFi Expert - ${value?.course?.level}`}
                </h2>

                {/* Description */}
                <p className="text-sm sm:text-lg mt-3 w-[90%] sm:w-8/12 md:w-7/12 leading-relaxed">
                    {value?.course?.description}
                </p>

                {/* Earn Badge Section */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-10 sm:mt-16 w-full">
                    <p className="text-sm sm:text-lg w-[90%] sm:w-8/12 md:w-6/12 leading-snug">
                        Earn your {value?.course?.level} certification by passing the lessons below
                    </p>
                    <img
                        src={
                            value?.course?.level === "Apprentice Level"
                                ? ApprenticeImage
                                : value?.course?.level?.includes("Expert")
                                    ? ExpertImage
                                    : MasterImage
                        }
                        alt="badge"
                        className="w-[45px] sm:w-48 md:w-48 mt-2 sm:mt-0"
                    />
                </div>

                {/* Optional Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-black/30 sm:bg-black/20 md:bg-black/10 -z-10"></div>
            </div>

            <div onClick={() => {
                navigate('/')
            }} className="cursor-pointer container flex w-full max-w-[1000px] mx-auto pt-10 px-4 items-center space-x-2">
                <FaArrowLeft /> <span>Back to Tier Selection</span>
            </div>


            {/* ✅ Render Modules */}
            {modules.length > 0 && modules.map((module, index) => {
                const progress = moduleProgressMap[module.id] || {};
                const lessons = module.lessons || [];
                const previousModuleProgress = moduleProgressMap[modules[index - 1]?.id];
                const isModuleUnlocked = index === 0 || (previousModuleProgress?.quiz_passed === true);
                const completedProgress = Number(progress.progress_percentage) || 0;
                const totalProgress = 100;
                const progressPercentage = totalProgress > 0 ? (completedProgress / totalProgress) * 100 : 0;
                const allVideosCompleted = lessons.every((lesson, i) => {
                    return progress.videos?.[i]?.total_videos === progress.videos?.[i]?.total_watched;
                });

                const quizPassed = progress.quiz_passed === true;

                const handleExamButtonClick = async (moduleID) => {
                    setModuleId(moduleID)
                    if(getKey()){
                        if (allVideosCompleted && !quizPassed) {
                            navigate(`/exam/${module.id}`);
                        } else if (allVideosCompleted && quizPassed) {
                            await toast.success("You have already passed the quiz for this module.");
                        }
                    } else{
                        setLoginModal(true)
                    }
                };

                let lastUnlockedLessonIndex = -1;
                lessons.forEach((lesson, i) => {
                    const isFirstLesson = i === 0;
                    const previousLessonCompleted = isFirstLesson || progress.videos?.[i - 1]?.completed;
                    if (previousLessonCompleted) {
                        lastUnlockedLessonIndex = i;
                    }
                });

                const lastUnlockedLesson = lessons[lastUnlockedLessonIndex];

                return (
                    <div key={module.id} className="container w-full max-w-[1000px] mx-auto py-5 md:px-4 px-1 rounded-md">
                        <div className="bg-white shadow-xl rounded-lg mt-4 ">
                            <div className={`flex justify-between items-center gap-2 p-0 bg-[#fff4ea]`}>
                                <div className="flex bg-[#fff4ea]">
                                    <h4 className="!text-sm md:text-lg text-white bg-[#ff7f00] py-2 px-1 md:p-4 w-[120px] h-[52px] md:h-[60px] flex items-center justify-center">MODULE {index + 1}</h4>
                                    <h3 className="flex items-center 2xl:text-17 xl:text-17 font-bold  md:p-4 p-1 py-2 sm:text-small-text md:text-17">{module.title}</h3>
                                </div>
                                <div className="w-[100px] md:w-auto py-2 md:p-4 bg-[#fff4ea] text-sm sm:text-small-text md:text-small-text text-[#a4a3a3]">
                                    {module.lectures_count} lectures
                                    <div>
                                   {module.total_duration}

                                    </div>
                                </div>
                            </div>
                            <div className={'px-4 mt-4 flex'}>
                                <div className="w-[95%] bg-gray rounded-full h-2.5 dark:bg-gray">
                                    <div className="bg-primary h-2.5 rounded-full"
                                        style={{ width: `${progressPercentage}%` }}></div>
                                </div>
                                <p className={'mt-[-8px] ml-2'}>{progressPercentage}%</p>
                            </div>
                            <div className="p-6">
                                {lessons.map((lesson, i) => {
                                    const isFirstLesson = i === 0;

                                    const previousLessonCompleted = isFirstLesson || progress.videos?.[i - 1]?.completed;
                                    const isLessonUnlocked = isFirstLesson ? isModuleUnlocked : previousLessonCompleted;

                                    return (
                                        <div key={lesson[1]}
                                            className="flex justify-between items-center border-b py-3">
                                            <p className="text-xs sm:text-sm md:text-base text-gray-700 flex items-center flex-wrap min-w-0 pr-2 gap-1 sm:gap-2">
                                                <FaYoutube className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                                                <span className="break-words flex-1">{lesson[0]}</span>
                                            </p>
                                            <button
                                                onClick={() => handleStart(module.id, lesson[1], index, quizPassed)}
                                                className={`px-4 py-1 text-sm rounded-md transition duration-300
                                        ${'bg-gradient-to-tl from-[#d99b2c] via-[#ae6b00] to-[#da8100] text-white'
                                                    }
                                    `}
                                            >
                                                {
                                                    isLessonUnlocked &&
                                                        (lesson[1] === lastUnlockedLesson[1] && !quizPassed)
                                                        ? (allVideosCompleted ? 'REVIEW' : 'START')
                                                        : (allVideosCompleted ? 'REVIEW' : 'START')
                                                }                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                            {quizPassed === false ?
                                <div className={'px-7 py-4 bg-gradient-to-r from-blue-900 via-blue-600 to-blue-900'}>
                                    <div
                                        className="flex justify-between items-center py-3">
                                        <p className="text-sm text-white  flex"><FaPen
                                            className={'mr-2 mt-1 fill-blue-300'} />Module {index + 1} Quiz</p>
                                        <button
                                            onClick={() => handleExamButtonClick(module.id)}
                                            className={`bg-white px-4 py-1 text-sm rounded-md ${getKey() && (allVideosCompleted || quizPassed) ? 'cursor-pointer' : !getKey() ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                                            disabled={getKey() && (!allVideosCompleted || quizPassed)}
                                        >
                                            TAKE EXAM
                                        </button>
                                    </div>
                                </div> : null}


                        </div>
                    </div>
                );
            })}


            <div className="container w-full max-w-[1000px] mx-auto py-10 px-4 shadow-lg">
                <h3 className="bg-[#0054c8] text-white p-6 text-lg font-bold">Beginner’s Guide to Digital Asset
                    Management</h3>

                {/*    <div className="mt-4 flex justify-between p-6 items-center pb-3">*/}
                {/*        <p className="flex items-center gap-2">*/}
                {/*            <FaPen className="text-darkGrey"/> Comprehensive Exam Covering All Modules*/}
                {/*        </p>*/}
                {/*        <button*/}
                {/*            className={`px-4 py-1 text-sm rounded-md transition duration-300 */}
                {/*    ${allQuizzesPassed*/}
                {/*                ? 'bg-gradient-to-tl from-[#d99b2c] via-[#ae6b00] to-[#da8100] text-white'*/}
                {/*                : 'bg-[#b4c2d5] text-white cursor-not-allowed'}*/}
                {/*`}*/}
                {/*            disabled={!allQuizzesPassed}*/}
                {/*        >*/}
                {/*            START*/}
                {/*        </button>*/}
                {/*    </div>*/}

                {/* Certification */}
                <div className="mt-4 flex p-6 justify-between items-center">
                    <p className="flex items-center gap-2">
                        <FaPen className="text-darkGrey" /> Earn Your {value?.course?.level} Certification
                    </p>
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            handleDownload()
                        }}
                        className={`px-4 py-1 text-sm rounded-md transition duration-300 
                        ${allQuizzesPassed
                                ? 'bg-gradient-to-tl from-[#d99b2c] via-[#ae6b00] to-[#da8100] text-white'
                                : 'bg-[#b4c2d5] text-white cursor-not-allowed'}
                        `}
                        disabled={!allQuizzesPassed}
                    >
                        Download Badge
                    </button>
                </div>
            </div>
            <Modal
                open={signupModal}
                onClose={() => setSignupModal(false)}
                center
                classNames={{
                    modal: "shadow-lg p-4 sm:p-6 sm-md:p-8 w-[95vw] sm:w-[90vw] sm-md:w-[600px] bg-blue-950 rounded-lg flex flex-col min-h-0",
                }}
                style={{ maxHeight: "90dvh" }}


            >
                <div className="bg-white p-5 sm:p-6 sm-md:p-8 w-full rounded-md flex-grow overflow-y-auto min-h-0">
                    {/* Logo */}
                    <img
                        src={FooterLogo}
                        alt="ProClaim Logo"
                        className="mb-6 sm:mb-8 sm-md:mb-10 w-[140px] sm:w-[170px] sm-md:w-[200px]"
                    />

                    {/* Form Container */}
                    <div className="flex flex-col min-h-0">
                        <form onSubmit={formik.handleSubmit}>
                            {/* Email */}
                            <div className="mb-5">
                                <label
                                    htmlFor="email"
                                    className="block text-gray-700 text-xs sm:text-sm sm-md:text-base font-semibold mb-2"
                                >
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    {...formik.getFieldProps("email")}
                                    className={`w-full p-2.5 sm:p-3 border ${formik.touched.email && formik.errors.email
                                            ? "border-red-500"
                                            : "border-gray-300"
                                        } rounded-md focus:outline-none focus:ring-2 focus:ring-[#d99b2c] text-xs sm:text-sm sm-md:text-base`}
                                    placeholder="Enter your email"
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="mb-5">
                                <label
                                    htmlFor="password"
                                    className="block text-gray-700 text-xs sm:text-sm sm-md:text-base font-semibold mb-2"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={newPasswordVisible ? "text" : "password"}
                                        {...formik.getFieldProps("password")}
                                        className={`w-full p-2.5 sm:p-3 border ${formik.touched.password && formik.errors.password
                                                ? "border-red-500"
                                                : "border-gray-300"
                                            } rounded-md focus:outline-none focus:ring-2 focus:ring-[#d99b2c] text-xs sm:text-sm sm-md:text-base`}
                                        placeholder="Enter your password"
                                    />
                                    <div
                                        onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                                    >
                                        {newPasswordVisible ? (
                                            <FontAwesomeIcon
                                                icon={faEyeSlash}
                                                size="sm"
                                                color="#ff700c"
                                                className="mr-1"
                                            />
                                        ) : (
                                            <FontAwesomeIcon
                                                icon={faEye}
                                                size="sm"
                                                color="#ff700c"
                                                className="mr-1"
                                            />
                                        )}
                                    </div>
                                </div>

                                {formik.touched.password && formik.errors.password && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {formik.errors.password}
                                    </p>
                                )}

                                {/* Password Requirements */}
                                <div className="mt-3 space-y-1">
                                    <PasswordRequirement
                                        isValid={passwordCriteria.hasUpperCase}
                                        text="Password should contain a capital letter"
                                    />
                                    <PasswordRequirement
                                        isValid={passwordCriteria.hasLowerCase}
                                        text="Password should contain a small letter"
                                    />
                                    <PasswordRequirement
                                        isValid={passwordCriteria.hasSpecialChar}
                                        text="Password should contain a special character"
                                    />
                                    <PasswordRequirement
                                        isValid={passwordCriteria.hasNumber}
                                        text="Password should contain a number"
                                    />
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="mb-5">
                                <label
                                    htmlFor="confirm_password"
                                    className="block text-gray-700 text-xs sm:text-sm sm-md:text-base font-semibold mb-2"
                                >
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirm_password"
                                        type={confirmPasswordVisible ? "text" : "password"}
                                        {...formik.getFieldProps("confirm_password")}
                                        className={`w-full p-2.5 sm:p-3 border ${formik.touched.confirm_password && formik.errors.confirm_password
                                                ? "border-red-500"
                                                : "border-gray-300"
                                            } rounded-md focus:outline-none focus:ring-2 focus:ring-[#d99b2c] text-xs sm:text-sm sm-md:text-base`}
                                        placeholder="Confirm your password"
                                    />
                                    <div
                                        onClick={() =>
                                            setConfirmPasswordVisible(!confirmPasswordVisible)
                                        }
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                                    >
                                        {confirmPasswordVisible ? (
                                            <FontAwesomeIcon
                                                icon={faEyeSlash}
                                                size="sm"
                                                color="#ff700c"
                                                className="mr-1"
                                            />
                                        ) : (
                                            <FontAwesomeIcon
                                                icon={faEye}
                                                size="sm"
                                                color="#ff700c"
                                                className="mr-1"
                                            />
                                        )}
                                    </div>
                                </div>

                                {formik.touched.confirm_password &&
                                    formik.errors.confirm_password && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {formik.errors.confirm_password}
                                        </p>
                                    )}

                                <PasswordRequirement
                                    isValid={passwordCriteria.matches}
                                    text="Password should match"
                                />
                            </div>

                            {/* Error Message */}
                            {err && (
                                <p className="text-red-500 text-xs sm:text-sm text-center mb-3 mt-2">
                                    {err}
                                </p>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-[#d99b2c] via-[#ae6b00] to-[#da8100] text-white py-2.5 sm:py-3 rounded-md transition duration-300 text-xs sm:text-sm sm-md:text-base font-semibold"
                            >
                                {formik.isSubmitting ? "Signing up..." : "SIGN UP"}
                            </button>
                        </form>

                        {/* Login Redirect */}
                        <p
                            className="mt-4 text-center text-xs sm:text-sm sm-md:text-base"
                            onClick={() => {
                                setSignupModal(false);
                                setLoginModal(true);
                            }}
                        >
                            Already have an account?{" "}
                            <span className="text-blue-950 cursor-pointer font-bold">Login</span>
                        </p>
                    </div>
                </div>
            </Modal>


            <Modal
                open={loginModal}
                onClose={() => setLoginModal(false)}
                center
                classNames={{
                    modal:
                        "shadow-lg p-4 sm:p-5 sm-md:p-8 w-[95vw] sm:w-[90vw] sm-md:w-[600px] max-h-[85vh] overflow-y-auto bg-blue-950 rounded-lg",
                }}
            >
                <div className="flex flex-col justify-center items-center">
                    {/* Logo */}
                    <img
                        src={FooterLogo}
                        alt="ProClaim Logo"
                        className="mb-6 sm:mb-8 sm-md:mb-10 w-[140px] sm:w-[170px] sm-md:w-[200px]"
                    />

                    {/* Form Container */}
                    <div className="bg-white p-5 sm:p-6 sm-md:p-8 w-full rounded-md">
                        <form onSubmit={formikLogin.handleSubmit}>
                            {/* Email Field */}
                            <div className="mb-5">
                                <label
                                    className="block text-gray-700 text-xs sm:text-sm sm-md:text-base font-semibold mb-2"
                                    htmlFor="email"
                                >
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    {...formikLogin.getFieldProps("email")}
                                    className={`w-full p-2.5 sm:p-3 border ${formikLogin.touched.email && formikLogin.errors.email
                                            ? "border-red-500"
                                            : "border-gray-300"
                                        } rounded-md focus:outline-none focus:ring-2 focus:ring-[#d99b2c] text-xs sm:text-sm sm-md:text-base`}
                                    placeholder="Enter your email"
                                />
                                {formikLogin.touched.email && formikLogin.errors.email && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {formikLogin.errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="mb-5">
                                <label
                                    className="block text-gray-700 text-xs sm:text-sm sm-md:text-base font-semibold mb-2"
                                    htmlFor="password"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={newPasswordVisible ? "text" : "password"}
                                        {...formikLogin.getFieldProps("password")}
                                        className={`w-full p-2.5 sm:p-3 border ${formikLogin.touched.password && formikLogin.errors.password
                                                ? "border-red-500"
                                                : "border-gray-300"
                                            } rounded-md focus:outline-none focus:ring-2 focus:ring-[#d99b2c] text-xs sm:text-sm sm-md:text-base`}
                                        placeholder="Enter your password"
                                    />
                                    <div
                                        onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                                    >
                                        {newPasswordVisible ? (
                                            <FontAwesomeIcon
                                                icon={faEyeSlash}
                                                size="sm"
                                                color="#ff700c"
                                                className="mr-1"
                                            />
                                        ) : (
                                            <FontAwesomeIcon
                                                icon={faEye}
                                                size="sm"
                                                color="#ff700c"
                                                className="mr-1"
                                            />
                                        )}
                                    </div>
                                </div>
                                {formikLogin.touched.password && formikLogin.errors.password && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {formikLogin.errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Error Message */}
                            {err && (
                                <p className="text-red-500 text-xs sm:text-sm text-center mb-3 mt-2">
                                    {err}
                                </p>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-[#d99b2c] via-[#ae6b00] to-[#da8100] text-white py-2.5 sm:py-3 rounded-md transition duration-300 text-xs sm:text-sm sm-md:text-base font-semibold"
                            >
                                {formikLogin.isSubmitting ? "LOGGING..." : "LOGIN"}
                            </button>
                        </form>

                        {/* Signup Redirect */}
                        <p
                            className="mt-4 text-center text-xs sm:text-sm sm-md:text-base"
                            onClick={() => {
                                setLoginModal(false);
                                setSignupModal(true);
                            }}
                        >
                            Don’t have an account?{" "}
                            <span className="text-blue-950 cursor-pointer font-bold">
                                Sign Up
                            </span>
                        </p>
                    </div>
                </div>
            </Modal>



        </div>
    );
};

export default ModulePage;