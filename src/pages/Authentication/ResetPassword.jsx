import React, { useState } from 'react';
import icon from '../../assets/images/updatedLogo.png';
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../../apis/Authentication/resetPassword";
import { toast } from "react-toastify";

const ResetPassword = () => {
    const navigate = useNavigate();
    const [state, setState] = useState({
        password: '',
        confirm_password: ''
    });
    const [errors, setErrors] = useState({});

    const params = useParams();

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const handleResetPassword = async () => {
        const newErrors = {};
        if (!validatePassword(state.password)) {
            newErrors.password = 'Password must contain at least 1 capital letter, 1 number, and 1 special character.';
        }
        if (state.password !== state.confirm_password) {
            newErrors.confirm_password = 'Passwords do not match.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return; // Stop the reset process if there are validation errors
        }

        const response = await resetPassword({ password: state.password, confirm_password: state.confirm_password, uuid: params.uuid });
        if (response.status === 200) {
            await toast.success(response.data.detail);
            navigate('/login');
        } else {
            toast.error('Password not set, Try Again');
        }
    };

    return (
        <div className="h-screen bg-blue-950 flex items-center justify-center">
            <div className={'justify-center items-center'}>
                <img src={icon} alt={''} width={'350'} className={'ml-[10px] mb-10'} />
                <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className={`w-full p-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#d99b2c]`}
                            placeholder="Enter your password"
                            onChange={(e) => {
                                setState((prev) => ({
                                    ...prev,
                                    password: e.target.value
                                }));
                                if (errors.password) setErrors((prev) => ({ ...prev, password: '' })); // Clear error on change
                            }}
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="confirm_password">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirm_password"
                            className={`w-full p-3 border ${errors.confirm_password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#d99b2c]`}
                            placeholder="Confirm your password"
                            onChange={(e) => {
                                setState((prev) => ({
                                    ...prev,
                                    confirm_password: e.target.value
                                }));
                                if (errors.confirm_password) setErrors((prev) => ({ ...prev, confirm_password: '' })); // Clear error on change
                            }}
                        />
                        {errors.confirm_password && <p className="text-red-500 text-sm">{errors.confirm_password}</p>}
                    </div>
                    <button
                        onClick={handleResetPassword}
                        className="w-full bg-gradient-to-r from-[#d99b2c] via-[#ae6b00] to-[#da8100] text-white py-3 rounded-md transition duration-300"
                    >
                        RESET PASSWORD
                    </button>
                    <p className={'mt-4 text-center'} onClick={() => navigate('/login')}>
                        Back to <span className={'text-blue-950 cursor-pointer font-bold'}>Login</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;