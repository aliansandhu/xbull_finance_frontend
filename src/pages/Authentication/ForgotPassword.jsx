import React, { useState } from 'react';
import icon from '../../assets/images/updatedLogo.png';
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../apis/Authentication/forgotPassword";
import { toast } from "react-toastify";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const handleSendEmail = async () => {
        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address.');
            return; // Stop the process if the email is invalid
        } else {
            setEmailError(''); // Clear the error if the email is valid
        }

        const response = await forgotPassword(email);
        if (response.status === 200) {
            await toast.success(response.data.message);
        } else {
            toast.error(response.message);
        }
    };

    return (
        <div className="h-screen bg-blue-950 flex items-center justify-center">
            <div className={'justify-center items-center'}>
                <img src={icon} alt={''} width={'350'} className={'ml-[10px] mb-10'} />
                <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className={`w-full p-3 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#d99b2c]`}
                            placeholder="Enter your email"
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (emailError) setEmailError(''); // Clear error on change
                            }}
                        />
                        {emailError && <p className="text-red-500 text-sm" style={{color: 'red'}}>{emailError}</p>}
                    </div>
                    <button
                        onClick={handleSendEmail}
                        className="w-full bg-gradient-to-r from-[#d99b2c] via-[#ae6b00] to-[#da8100] text-white py-3 rounded-md transition duration-300"
                    >
                        SEND EMAIL
                    </button>
                    <p className={'mt-4 text-center'} onClick={() => navigate('/login')}>
                        Back to <span className={'text-blue-950 cursor-pointer font-bold'}>Login</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;