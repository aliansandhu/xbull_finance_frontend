import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import icon from '../../assets/images/updatedLogo.png';
import { userLogin } from "../../apis/Authentication/login";
import { setKey } from "../../helpers/setKey";
import { getKey } from "../../helpers/getKey";
import { useAppContext } from "../../helpers/Context/AppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

// ✅ Validation schema using Yup
const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
});

const LoginPage = () => {
    const navigate = useNavigate();
    const { setValue } = useAppContext();
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (getKey()) {
            navigate('/');
        }
    }, [navigate]);

    const handleLogin = async (values, { setSubmitting, setFieldError }) => {
        try {
            const response = await userLogin(values.email, values.password);
            if (response.status === 200) {
                setKey(response.data.token);
                setValue((prev) => ({
                    ...prev,
                    user: response?.data?.user,
                }));
                navigate('/');
            } else {
                setFieldError('password', response.message || 'Invalid credentials');
            }
        } catch (error) {
            setFieldError('password', 'Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="h-screen bg-blue-950 flex items-center justify-center">
            <div className="flex flex-col justify-center items-center w-full">
                <img src={icon} alt="" className="mb-10 max-w-[350px] w-full" onClick={() => navigate('/')} style={{ cursor: 'pointer' }} />

                <div className="bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-[500px]">
                    <p className="text-black text-center mb-6 text-lg font-bold">
                        Login or <span style={{ color: '#3b82f6' }} className="cursor-pointer" onClick={() => navigate('/signup')}>Create an account</span> to take exam or save progress
                    </p>
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validationSchema={LoginSchema}
                        onSubmit={handleLogin}
                    >
                        {({ isSubmitting, handleKeyDown }) => (
                            <Form>
                                {/* Email Field */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                                        Email
                                    </label>
                                    <Field
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d99b2c]"
                                        placeholder="Enter your email"
                                    />
                                    <ErrorMessage
                                        name="email"
                                        component="div"
                                        style={{ color: 'red' }}
                                        className="mt-1"
                                    />
                                </div>

                                {/* Password Field */}
                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Field
                                            type={newPasswordVisible ? 'text' : 'password'}
                                            id="password"
                                            name="password"
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d99b2c]"
                                            placeholder="Enter your password"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleKeyDown?.(e);
                                            }}
                                        />
                                        <div
                                            onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                                        >
                                            {newPasswordVisible ? (
                                                <FontAwesomeIcon icon={faEyeSlash} size="1x" color="#ff700c" className="mr-2" />
                                            ) : (
                                                <FontAwesomeIcon icon={faEye} size="1x" color="#ff700c" className="mr-2" />
                                            )}
                                        </div>
                                    </div>
                                    <ErrorMessage
                                        name="password"
                                        component="div"
                                        style={{ color: 'red' }}
                                        className="mt-1"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-[#d99b2c] via-[#ae6b00] to-[#da8100] text-white py-3 rounded-md transition duration-300 disabled:opacity-70"
                                >
                                    {isSubmitting ? 'LOGGING...' : 'LOGIN'}
                                </button>

                                <p
                                    className="mt-4 text-center font-bold cursor-pointer"
                                    onClick={() => navigate('/forgot-password')}
                                >
                                    Forgot Password
                                </p>

                                <p className="mt-4 text-center">
                                    Don't have an account?{' '}
                                    <span
                                        className="text-blue-950 cursor-pointer font-bold"
                                        onClick={() => navigate('/signup')}
                                    >
                                        Sign Up
                                    </span>
                                </p>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
