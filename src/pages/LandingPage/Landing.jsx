import React, {useEffect, useState} from "react";
import coverImage from '../../assets/images/site_background.jpeg';
import avatar from '../../assets/images/avatar.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faClock, faBookOpen, faListCheck, faChevronLeft, faChevronRight, faChevronUp, faChevronDown} from '@fortawesome/free-solid-svg-icons';
import {useNavigate} from "react-router-dom";
import { faqs, testimonials } from "../../helpers/constants";
import {getCourses} from "../../apis/Module/courses";
import {useAppContext} from "../../helpers/Context/AppContext";
import XLogo from "../../assets/images/x_logo.png";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';


const Landing = () => {
    const navigate = useNavigate()
    const [courses, setCourses] = useState([])
    const [openIndexes, setOpenIndexes] = useState({});
    const [loading, setLoading] = useState(true)

    const { setValue } = useAppContext();


    useEffect(() => {
        setLoading(true)
        getCourses().then((res) => {
            setCourses(res.data)
        }).catch((e) => {
            setLoading(false)
        }).finally(() => {
            setLoading(false)
        })
    }, []);

    const tierHandling = (title) => {
        if (title.includes("Apprentice")) {
            return {tier: 'Tier 1', bgColor: 'bg-[#5f85b9]', level: 'Apprentice Level', tierImage: 'https://my-xfinancebull-backend.s3.eu-north-1.amazonaws.com/Apprentice.png'}
        } else if (title.includes("Expert")) {
            return {tier: 'Tier 2', bgColor: 'bg-[#0054c8]', level: 'Expert Level', tierImage: 'https://my-xfinancebull-backend.s3.eu-north-1.amazonaws.com/Expert.png'}
        } else{
            return {tier: 'Tier 3', bgColor: 'bg-[#ff7f00]', level: 'Master Level', tierImage: 'https://my-xfinancebull-backend.s3.eu-north-1.amazonaws.com/Master.png'}
        }
    }

    const toggleAnswer = (sectionIndex, questionIndex) => {
        setOpenIndexes(prevState => ({
            ...prevState,
            [sectionIndex]: prevState[sectionIndex] === questionIndex ? null : questionIndex, // Toggle answer visibility for the specific section
        }));
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
        <div className="bg-blue-50 w-full">
            {/* Hero Section */}
            <div className="bg-gray-100 relative lg:min-h-[850px]">
                {/* Hero Section */}
                <div className="relative w-full">
                    <img src={coverImage} alt="X Finance Bull Academy" className="w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] object-cover"/>
                    <div
                        className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-42 font-bold">X-Finance Bull Academy Curriculum</h2>
                        <p className="text-sm sm:text-base md:text-lg mt-2">Welcome to X Finance Bull Defi Academy</p>
                    </div>
                </div>

                {/* Courses Section */}
                <div className={'flex justify-center items-center mt-4 sm:mt-6 md:mt-8 lg:mt-0 lg:absolute lg:inset-x-0 lg:top-[350px]'}>
                    <div className="relative lg:relative z-40 w-full max-w-[1200px] mx-auto rounded-lg p-4 sm:p-6">
                        <Swiper
                            modules={[Navigation]}
                            spaceBetween={24}
                            slidesPerView={1}
                            slidesPerGroup={1}
                            navigation={{
                                nextEl: '.swiper-button-next-courses',
                                prevEl: '.swiper-button-prev-courses',
                            }}
                            breakpoints={{
                                320: {
                                    slidesPerView: 1,
                                    spaceBetween: 16,
                                },
                                640: {
                                    slidesPerView: 1,
                                    spaceBetween: 20,
                                },
                                768: {
                                    slidesPerView: 2,
                                    spaceBetween: 20,
                                },
                                1024: {
                                    slidesPerView: 3,
                                    spaceBetween: 24,
                                },
                            }}
                            className="courses-swiper"
                        >
                            {/* API Cards - Only first 2 */}
                            {courses?.length > 0 && courses?.slice(0, 2).map((course, index) => {
                                return (
                                    <SwiperSlide key={`api-${index}`}>
                                        <div className="bg-white shadow-lg overflow-hidden flex flex-col rounded-xl  md:h-[720px] lg:h-[650px]">
                                            {/* Card Header with image and tier */}
                                            <div className="relative">
                                                <img src={course.course_image} alt={course.title}
                                                     className="w-auto h-auto px-4 sm:px-6 md:px-10 mt-2"/>
                                                <div
                                                    className={`${tierHandling(course.level).bgColor} absolute top-0 left-0 w-[80px] sm:w-[90px] md:w-[100px] text-white px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 text-sm sm:text-base md:text-lg font-semibold`}>
                                                    Tier {course.tier}
                                                </div>
                                            </div>

                                            {/* Card Body with content */}
                                            <div className="flex flex-col p-4 sm:p-5 md:p-6">
                                                <h2 className="text-center mb-2 sm:mb-3 text-12 sm:text-16 md:text-20 font-bold line-clamp-2">{course.title}</h2>
                                                <div className="py-4 pt-0 mt-auto">
                                                    <button
                                                        onClick={() => {
                                                        navigate(`/course/${course.id}`);
                                                        setValue((prev) => ({
                                                            ...prev,
                                                            course: course
                                                        }));
                                                        localStorage.setItem('courseID', course.id);
                                                    }}
                                                            className={'bg-gradient-to-r from-[#d99b2c] via-[#ae6b00] to-[#da8100] hover:from-[#efb55a] hover:via-[#b76a00] hover:to-[#ff8f1a] text-[15px] text-white px-4 py-2 rounded-md w-full transition duration-400 ease-in-out transform hover:scale-105 '}>
                                                        {course.progress_percentage !== 0.00 ? 'Resume the course' : 'Start Course'}
                                                    </button>
                                                </div>
                                                <div className="flex gap-2 text-gray-600 mt-4 w-full">
                                                    <div className="flex items-center gap-1 w-1/3"><FontAwesomeIcon
                                                        icon={faClock}
                                                        className={'stroke-my fill-transparent'}/> {course.total_duration_hours}H
                                                    </div>
                                                    <div className="flex items-center gap-1 w-1/3"><FontAwesomeIcon
                                                        icon={faBookOpen}/> {course.total_videos}</div>
                                                    <div className="flex items-center gap-1 w-1/3"><FontAwesomeIcon
                                                        icon={faListCheck}/> {course.progress_percentage}%
                                                    </div>
                                                </div>
                                                <p className="mt-4 text-gray-600 text-sm">{course.description}</p>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                )
                            })}

                            {/* Static Tier 3 Card at the end */}
                            <SwiperSlide key="static-tier3">
                                <div className="bg-white shadow-lg overflow-hidden flex flex-col rounded-xl md:h-[720px] lg:h-[650px]">
                                    {/* Card Header with image and tier */}
                                    <div className="relative">
                                        <img src={tierHandling('Master').tierImage} alt={''}
                                             className="w-auto h-auto px-4 sm:px-6 md:px-10 mt-2"/>
                                        <div
                                            className={`${tierHandling('Master').bgColor} absolute top-0 left-0 w-[80px] sm:w-[90px] md:w-[100px] text-white px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 text-sm sm:text-base md:text-lg font-semibold`}>
                                            Tier 3
                                        </div>
                                    </div>
                                    {/* Card Body with content */}
                                    <div className="flex flex-col p-4 sm:p-5 md:p-6">
                                        <h2 className="text-center mb-2 sm:mb-3 text-12 sm:text-16 md:text-20 font-bold line-clamp-2">{'DeFi Master'}</h2>
                                        <div className="py-4 pt-0 mt-auto">
                                            <button className="bg-gray cursor-not-allowed text-white text-[15px] px-4 py-2 rounded-md w-full">
                                                Invite Only
                                            </button>
                                        </div>
                                        <div className="flex gap-2 text-gray-600 mt-4 w-full">
                                        </div>
                                        <p className="mt-4 text-gray-600 text-sm">Our 3rd Master tier was built to get you a
                                            complex understanding of ALL the elements inside of Defi & Web3. This tier will
                                            allow you to call yourself a Master and you will join our Master partners page
                                            on
                                            the site.</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        </Swiper>
                        {/* Custom Navigation Buttons for Courses */}
                        <button 
                            type="button"
                            className="swiper-button-prev-courses absolute left-2 sm:left-4 md:left-0 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-colors shadow-lg cursor-pointer border border-gray-200"
                            aria-label="Previous course"
                        >
                            <FontAwesomeIcon icon={faChevronLeft} className="text-blue-600 text-base sm:text-lg" />
                        </button>
                        <button 
                            type="button"
                            className="swiper-button-next-courses absolute right-2 sm:right-4 md:right-0 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-colors shadow-lg cursor-pointer border border-gray-200"
                            aria-label="Next course"
                        >
                            <FontAwesomeIcon icon={faChevronRight} className="text-blue-600 text-base sm:text-lg" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div className=" lg:mt-32 text-center bg-blue-50 md:py-8 py-4">
                <h2 className="text-2xl sm:text-4xl md:text-4xl lg:text-36 font-bold md:my-6 text-gray-800">See what people are saying</h2>
                <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 relative max-w-7xl sm:mt-4  lg:mt-0">
                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={24}
                        slidesPerView={3}
                        slidesPerGroup={1}
                        loop={true}
                        navigation={{
                            nextEl: '.swiper-button-next-custom',
                            prevEl: '.swiper-button-prev-custom',
                        }}
                        breakpoints={{
                            320: {
                                slidesPerView: 1,
                                spaceBetween: 16,
                            },
                            768: {
                                slidesPerView: 2,
                                spaceBetween: 20,
                            },
                            1024: {
                                slidesPerView: 3,
                                spaceBetween: 24,
                            },
                        }}
                        className="testimonials-swiper"
                    >
                        {testimonials.map((testimonial, index) => (
                            <SwiperSlide key={index}>
                           
                                <div key={index} className="p-4 sm:p-5 md:p-6 bg-white rounded-lg h-[200px] sm:h-[200px] md:h-[250px] lg:h-[250px] xl:h-[250px] flex flex-col">
                                <p className="italic text-sm sm:text-base md:text-lg flex-grow overflow-y-auto">"{testimonial.text}"</p>
                                <p className="mt-4 font-semibold text-sm sm:text-base md:text-lg flex-shrink-0">{testimonial.name}</p>
                            </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    {/* Custom Navigation Buttons */}
                    <button 
                        type="button"
                        className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-gray-200 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer transform hover:scale-110 active:scale-95 border border-black"
                        aria-label="Previous testimonial"
                    >
                        <FontAwesomeIcon icon={faChevronLeft} className="text-blue-600 text-lg transition-colors duration-300 hover:text-white" />
                    </button>
                    <button 
                        type="button"
                        className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-gray-200 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer transform hover:scale-110 active:scale-95 border border-black"
                        aria-label="Next testimonial"
                    >
                        <FontAwesomeIcon icon={faChevronRight} className="text-blue-600 text-lg transition-colors duration-300 hover:text-white" />
                    </button>
                </div>
            </div>

            {/* FAQ Section */}
                    <div className="text-center pb-8">

                    <h2 className="text-2xl sm:text-4xl md:text-4xl lg:text-36  font-bold  text-gray-900">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-gray-600 text-base sm:text-lg">Find answers to common questions about our courses</p>
                    </div>
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center bg-gradient-to-b from-white to-blue-50">
                <div className="max-w-6xl mx-auto w-full">
                    {faqs.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
                            {/* Section Title */}
                            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6 text-left px-2 sm:px-0 border-b-2 border-blue-100 pb-3">
                                {section.title}
                            </h3>

                            {/* Questions */}
                            {section.questions.map((faq, faqIndex) => {
                                const isOpen = openIndexes[sectionIndex] === faqIndex;
                                return (
                                    <div key={faqIndex} className="mb-3 sm:mb-4">
                                        {/* FAQ Card */}
                                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-blue-100">
                                            {/* Question Row */}
                                            <div
                                                className={`flex justify-between items-center gap-3 sm:gap-4 cursor-pointer hover:bg-blue-50 transition-all duration-200 ${
                                                    isOpen ? 'py-4 px-4 sm:py-5 sm:px-5 md:py-6 md:px-6 bg-blue-50' : 'py-3 px-4 sm:py-4 sm:px-5'
                                                }`}
                                                onClick={() => toggleAnswer(sectionIndex, faqIndex)}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        e.preventDefault();
                                                        toggleAnswer(sectionIndex, faqIndex);
                                                    }
                                                }}
                                                aria-expanded={isOpen}
                                                aria-controls={`faq-answer-${sectionIndex}-${faqIndex}`}
                                            >
                                                <span className={`font-semibold text-gray-900 flex-1 text-left leading-tight sm:leading-normal transition-all duration-200 ${
                                                    isOpen ? 'text-sm sm:text-base md:text-lg lg:text-xl' : 'text-sm sm:text-base md:text-lg'
                                                }`}>
                                                    {faq.question}
                                                </span>
                                                {/* Circular Blue Button with Chevron */}
                                                <button
                                                    type="button"
                                                    className={`rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0 hover:from-blue-700 hover:to-blue-800 active:from-blue-800 active:to-blue-900 transition-all duration-200 transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md ${
                                                        isOpen ? 'w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rotate-180' : 'w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10'
                                                    }`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleAnswer(sectionIndex, faqIndex);
                                                    }}
                                                    aria-label={isOpen ? 'Collapse answer' : 'Expand answer'}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faChevronDown}
                                                        className="text-white text-xs sm:text-sm transition-transform duration-300"
                                                    />
                                                </button>
                                            </div>

                                            {/* Answer with smooth animation */}
                                            <div
                                                id={`faq-answer-${sectionIndex}-${faqIndex}`}
                                                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                                    isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                                                }`}
                                            >
                                                {isOpen && (
                                                    <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6 pt-0 bg-blue-50/30">
                                                        <p className="text-sm sm:text-base md:text-lg text-gray-700 text-left leading-relaxed">
                                                            {faq.answer}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}


export default Landing;
