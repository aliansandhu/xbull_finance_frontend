import React, {useState} from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {useAppContext} from "../../helpers/Context/AppContext";
import PhoneInput from "react-phone-number-input";
import {faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import {updatePassword, updateProfile} from "../../apis/ProfilePage/profileAPI";
import {toast} from "react-toastify";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useNavigate} from "react-router-dom";
import {FaLock} from "react-icons/fa";


const UserProfile = () => {
    const { value } = useAppContext();
    const navigate = useNavigate()

    const user = value?.user
    const [phoneNumber, setPhoneNumber] = useState(user?.phone_number);
    const [tabState, setTabState] = useState('profile')
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);

    const { setValue } = useAppContext();



    const validationSchema = Yup.object({
        first_name: Yup.string().required('First name is required').nullable(),
        last_name: Yup.string().required('Last name is required').nullable(),
        email: Yup.string().email('Invalid email format').required('Email is required'),
        phone_number: Yup.string()
            .nullable(),
        address: Yup.string().nullable(),
        city: Yup.string().nullable(),
        state: Yup.string().nullable(),
        zip_code: Yup.string()
            .nullable(),
        x_handle: Yup.string().nullable(),
    });

    const validationSchemaPassword = Yup.object({
        password: Yup.string()
            .required('Password is required')
            .min(8, 'Password must be at least 8 characters')
            .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
            .matches(/[0-9]/, 'Password must contain at least one number')
            .matches(/[@$!%*?&]/, 'Password must contain at least one special character'), // You can adjust the regex based on your password policy
        confirm_password: Yup.string()
            .required('Confirm password is required')
            .oneOf([Yup.ref('password'), null], 'Passwords must match'), // Ensures that confirm_password matches password
    });

    const handleUpdateProfile = (values) => {
        updateProfile(values).then((res) => {
            toast.success('Profile updated successfully')
            setValue((prev) => ({
                ...prev,
                user: res?.data
            }))
            navigate('/')
        }).catch((err) => {
            console.log(err)
            toast.error('Unable to update Profile')
        })
    }

    const handlePasswordUpdate = (values) => {
        const {password, confirm_password} = values
        updatePassword({password, confirm_password}).then((res) => {
            console.log(res)
            toast.success('Password updated successfully')
            navigate('/')
        }).catch((err) => {
            console.log(err)
            toast.error('Unable to Update Password')
        })
    }

    return(
        <div className="relative w-full mx-auto px-2 py-8 max-w-7xl">
            <div className="md:flex">
                <ul className="flex-column space-y space-y-4 text-sm font-medium text-gray-500 dark:text-gray-400 md:me-4 mb-4 md:mb-0">
                    <li>
                        <button
                            onClick={() => {
                                setTabState('profile')
                            }}
                           className={`inline-flex items-center px-4 py-3 rounded-lg ${tabState === 'profile' ? 'active dark:bg-blue-950 text-white' : ''} w-full`}
                           aria-current="page">
                            <svg className={`w-4 h-4 me-2 ${tabState === 'profile' ? 'text-white' : 'text-blue-950'} `} aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                            </svg>
                            Profile
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setTabState('password')}
                           className={`inline-flex items-center px-4 py-3 rounded-lg ${tabState === 'password' ? 'active dark:bg-blue-950 text-white' : ''} bg-gray-50  w-full `}>
                            <FaLock className={`w-4 h-4 me-2 ${tabState === 'password' ? 'text-white' : 'text-blue-950'} `} />
                            Password
                        </button>
                    </li>
                </ul>
                {tabState === 'profile' ? <div
                    id={'profile'}
                    className="p-6 bg-gray-50 text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 rounded-lg w-full">
                    <Formik
                        initialValues={{
                            first_name: user?.first_name,
                            last_name: user?.last_name,
                            email: user?.email,
                            phone_number: phoneNumber,
                            address: user?.address,
                            city: user?.city,
                            state: user?.state,
                            zip_code: user?.zip_code,
                            x_handle: user?.x_handle,
                            is_active: true,
                            is_superuser: false,
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values) => {
                            handleUpdateProfile(values)
                        }}
                    >
                        {({setFieldValue}) => (
                            <Form className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-4xl mx-auto">
                                {/* First Name */}
                                <div className="col-span-1">
                                    <label htmlFor="first_name" className="block text-sm font-bold text-gray-700">
                                        First Name
                                    </label>
                                    <Field
                                        type="text"
                                        id="first_name"
                                        placeholder={"First Name"}
                                        name="first_name"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <ErrorMessage name="first_name" component="div"
                                                  className="text-red-500 text-xs mt-1"/>
                                </div>

                                {/* Last Name */}
                                <div className="col-span-1">
                                    <label htmlFor="last_name" className="block text-sm font-bold text-gray-700">
                                        Last Name
                                    </label>
                                    <Field
                                        type="text"
                                        id="last_name"
                                        name="last_name"
                                        placeholder={"Last Name"}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <ErrorMessage name="last_name" component="div"
                                                  className="text-red-500 text-xs mt-1"/>
                                </div>

                                {/* Email */}
                                <div className="col-span-1">
                                    <label htmlFor="email" className="block text-sm font-bold text-gray-700">
                                        Email
                                    </label>
                                    <Field
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder={"Email"}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1"/>
                                </div>

                                {/* Phone Number */}
                                <div className="col-span-1">
                                    <label htmlFor="phone_number" className="block text-sm font-bold text-gray-700">
                                        Phone Number
                                    </label>
                                    <PhoneInput
                                        country={'us'} // Default country code
                                        value={phoneNumber}
                                        onChange={(phone) => {
                                            setPhoneNumber(phone); // Update local state
                                            setFieldValue('phone_number', phone); // Update Formik state
                                        }}
                                        placeholder="Enter phone number"
                                        className="p-3 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        style={{border: '1px solid #000', borderRadius: '0.375rem', outline: 'none'}}
                                    />
                                    <ErrorMessage name="phone_number" component="div"
                                                  className="text-red-500 text-xs mt-1"/>
                                </div>

                                {/* Address */}
                                <div className="col-span-1 md:col-span-2">
                                    <label htmlFor="address" className="block text-sm font-bold text-gray-700">
                                        Address
                                    </label>
                                    <Field
                                        type="text"
                                        id="address"
                                        name="address"
                                        placeholder={"Address"}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <ErrorMessage name="address" component="div" className="text-red-500 text-xs mt-1"/>
                                </div>

                                {/* City */}
                                <div className="col-span-1">
                                    <label htmlFor="city" className="block text-sm font-bold text-gray-700">
                                        City
                                    </label>
                                    <Field
                                        type="text"
                                        id="city"
                                        name="city"
                                        placeholder={"City"}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <ErrorMessage name="city" component="div" className="text-red-500 text-xs mt-1"/>
                                </div>

                                {/* State */}
                                <div className="col-span-1">
                                    <label htmlFor="state" className="block text-sm font-bold text-gray-700">
                                        State
                                    </label>
                                    <Field
                                        type="text"
                                        id="state"
                                        name="state"
                                        placeholder={"State"}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <ErrorMessage name="state" component="div" className="text-red-500 text-xs mt-1"/>
                                </div>

                                {/* Zip Code */}
                                <div className="col-span-1">
                                    <label htmlFor="zip_code" className="block text-sm font-bold text-gray-700">
                                        Zip Code
                                    </label>
                                    <Field
                                        type="text"
                                        id="zip_code"
                                        name="zip_code"
                                        placeholder={"Zip Code"}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <ErrorMessage name="zip_code" component="div"
                                                  className="text-red-500 text-xs mt-1"/>
                                </div>

                                {/* X Handle */}
                                <div className="col-span-1">
                                    <label htmlFor="x_handle" className="block text-sm font-bold text-gray-700">
                                        X Handle
                                    </label>
                                    <Field
                                        type="text"
                                        id="x_handle"
                                        name="x_handle"
                                        placeholder={"X-Handle"}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <ErrorMessage name="x_handle" component="div"
                                                  className="text-red-500 text-xs mt-1"/>
                                </div>

                                <div className="w-25 flex justify-end">
                                    <button
                                        type="submit"
                                        className="w-full py-2 px-4 bg-blue-950 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>

                </div> : tabState === 'password' ? <div className={'p-6 bg-gray-50 text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 rounded-lg w-full mb-48'}>
                    <Formik
                        initialValues={{
                            password: '',
                            confirm_password: '',
                        }}
                        validationSchema={validationSchemaPassword}
                        onSubmit={(valuesEntered) => {
                            handlePasswordUpdate(valuesEntered)
                        }}
                    >
                        {() => (
                            <Form className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-4xl mx-auto">
                                {/* First Name */}
                                <div className="col-span-1">
                                    <label htmlFor="password" className="block text-sm font-bold text-gray-700">
                                        New Password
                                    </label>
                                    <div className="relative"> {/* Wrap the input and icon in a relative container */}
                                        <Field
                                            type={newPasswordVisible ? 'text' : 'password'}
                                            id="password"
                                            placeholder="New Password"
                                            name="password"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 pr-10" // Add padding to the right
                                        />
                                        <div
                                            onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" // Position the icon inside the input
                                        >
                                            {newPasswordVisible ? (
                                                <FontAwesomeIcon icon={faEyeSlash} size="1x" color="#ff700c"
                                                                 className="mr-2"/>
                                            ) : (
                                                <FontAwesomeIcon icon={faEye} size="1x" color="#ff700c"
                                                                 className="mr-2"/>
                                            )}
                                        </div>
                                    </div>
                                    <ErrorMessage name="password" component="div"
                                                  className="text-red-500 text-xs mt-1"/>
                                </div>

                                {/* Last Name */}
                                <div className="col-span-1">
                                    <label htmlFor="confirm_password" className="block text-sm font-bold text-gray-700">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <Field
                                            type={confirmPasswordVisible ? 'text' : 'password'}
                                            id="confirm_password"
                                            name="confirm_password"
                                            placeholder="Confirm Password"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 pr-10" // Add padding to the right
                                        />
                                        <div
                                            onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                                        >
                                            {confirmPasswordVisible ? (
                                                <FontAwesomeIcon icon={faEyeSlash} size="1x" color="#ff700c"
                                                                 className="mr-2"/>
                                            ) : (
                                                <FontAwesomeIcon icon={faEye} size="1x" color="#ff700c"
                                                                 className="mr-2"/>
                                            )}
                                        </div>
                                    </div>
                                    <ErrorMessage name="confirm_password" component="div"
                                                  className="text-red-500 text-xs mt-1"/>
                                </div>

                                <div className="w-48 flex justify-end">
                                    <button
                                        type="submit"
                                        className="w-full py-2 px-4 bg-blue-950 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                    >
                                        Update Password
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div> : ''}

            </div>
        </div>
    )
}

export default UserProfile