import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import { useAppContext } from "../../helpers/Context/AppContext";
import { toast } from "react-toastify";


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

const CompletionCard = ({ moduleCount, videoProgress }) => {
    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();

    const [loginModal, setLoginModal] = useState(false)
    const [signupModal, setSignupModal] = useState(false)

    const { value, setValue } = useAppContext();


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
                    navigate(`/exam/${params.moduleId}`);
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
                    navigate(`/exam/${params.moduleId}`);
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


    const handlePDFLink = () => {
        if(params.moduleId === "1"){
            return 'https://my-xfinancebull-backend.s3.eu-north-1.amazonaws.com/Module+1+-+PDF+Summary.pdf'
        } else if(params.moduleId === "2"){
            return 'https://my-xfinancebull-backend.s3.eu-north-1.amazonaws.com/Module+2+PDF.pdf'
        } else if(params.moduleId === "3"){
            return 'https://my-xfinancebull-backend.s3.eu-north-1.amazonaws.com/Module+3+-+PDF+Document.pdf'
        } else if(params.moduleId === "4"){
            return 'https://my-xfinancebull-backend.s3.eu-north-1.amazonaws.com/Module+4+-+PDF+Document.pdf'
        } else if(params.moduleId === "5"){
            return 'https://my-xfinancebull-backend.s3.eu-north-1.amazonaws.com/Mdoule+1+Lesson+5.pdf'
        } else if(params.moduleId === "6"){
            return 'https://my-xfinancebull-backend.s3.eu-north-1.amazonaws.com/Module+1+-+Lesson+6+-+PDF+Document.pdf'
        } else if(params.moduleId === "7"){
            return 'https://my-xfinancebull-backend.s3.eu-north-1.amazonaws.com/Module+1+-+Lesson+7++PDF.pdf'
        } else if(params.moduleId === "15"){
            return 'https://my-xfinancebull-backend.s3.eu-north-1.amazonaws.com/Tier+2+-+Lesson+1+-+PDF.pdf'
        } else if(params.moduleId === "16"){
            return 'https://my-xfinancebull-backend.s3.eu-north-1.amazonaws.com/Tier+2+-+Lesson+2+-+PDF.pdf'
        } else if(params.moduleId === "17"){
            return 'https://my-xfinancebull-backend.s3.eu-north-1.amazonaws.com/Tier+2+-+Lesson+3+-+PDF.pdf'
        } else if(params.moduleId === "18"){
            return 'https://my-xfinancebull-backend.s3.eu-north-1.amazonaws.com/Tier+2+-+Lesson+4+-+PDF.pdf'
        } else if(params.moduleId === "19"){
            return 'https://my-xfinancebull-backend.s3.eu-north-1.amazonaws.com/Tier+2+-+Lesson+5+-+PDF.pdf'
        } else if(params.moduleId === "20"){
            return 'https://my-xfinancebull-backend.s3.eu-north-1.amazonaws.com/Tier+2+-+Lesson+6+-+PDF.pdf'
        }
    }

    return (
        <div
            className="w-full max-w-[90%] mx-auto mt-10 border border-gray-300 bg-white rounded-lg p-4 text-center relative">
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
            <h2 className="text-lg sm:text-xl font-bold">CONGRATULATIONS!</h2>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
                You have successfully completed all lessons from Module {moduleCount}.
            </p>

            {/* Exam Button */}
            <div className="mt-4 flex flex-col items-center justify-center space-y-2">
                <p className="text-sm sm:text-base font-bold text-gray-800 text-center">
                    Ready to take this lesson’s exam?
                </p>
                {!videoProgress.complete ? (
                    <button
                        onClick={() => {
                            if(!getKey()){
                                setLoginModal(true)
                            } else{
                                navigate(`/exam/${params.moduleId}`);
                            }
                        }}
                        className="bg-gradient-to-r from-[#d99b2c] via-[#ae6b00] to-[#da8100] text-white font-bold py-2 px-3 rounded-md shadow-md hover:opacity-90 transition duration-300 text-sm sm:text-base"
                    >
                        TAKE EXAM
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            navigate(`/next-lesson/${params.moduleId}`);
                        }}
                        className="bg-gradient-to-r from-[#d99b2c] via-[#ae6b00] to-[#da8100] text-white font-bold py-2 px-3 rounded-md shadow-md hover:opacity-90 transition duration-300 text-sm sm:text-base"
                    >
                        NEXT LESSON
                    </button>
                )}
            </div>

            {/* Link to review lessons */}
            <p className="mt-4 text-gray-600 text-xs sm:text-sm">
                If not,{" "}
                <a href={handlePDFLink()} target={'_blank'} className="text-[#008ae6] font-semibold underline">
                    click here
                </a>{" "}
                to review written lessons.
            </p>
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
        </div>
    );
};

export default CompletionCard;