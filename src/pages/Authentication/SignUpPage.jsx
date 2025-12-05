import React, { useState, useEffect } from "react";
import icon from "../../assets/images/updatedLogo.png";
import { useNavigate } from "react-router-dom";
import { userRegister, userSignup } from "../../apis/Authentication/signup";
import { getKey } from "../../helpers/getKey";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { toast } from "react-toastify";
import { FaCheck, FaTimes } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useFormik } from "formik";
import * as Yup from "yup";

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

const SignUpPage = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [err, setErr] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (getKey()) {
      navigate('/');
    }
  }, [navigate]);

  // ✅ Yup Validation Schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Please enter a valid email address.")
      .required("Email is required."),
    // first_name: Yup.string().required("First name is required."),
    // last_name: Yup.string().required("Last name is required."),
    // xhandle: Yup.string().required("X-Handle is required."),
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
          navigate("/login");
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

  return (
    <div className="h-full py-8 bg-blue-950 flex items-center justify-center">
      <div className="flex flex-col justify-center items-center w-full">
        <img src={icon} alt="" className="mb-10 max-w-[350px] w-full" />

        <div className="bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-[500px]">
          <p className="text-black text-center mb-6 text-lg font-bold">
            Login or <span style={{ color: '#3b82f6' }} className="cursor-pointer" onClick={() => navigate('/signup')}>Create an account</span> to take exam or save progress
          </p>
          <form onSubmit={formik.handleSubmit}>
            {/* Email */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...formik.getFieldProps("email")}
                className={`w-full p-3 border ${formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#d99b2c]`}
                placeholder="Enter your email"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm">{formik.errors.email}</p>
              )}
            </div>

            {/* First Name */}
            {/* <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="first_name">
                First Name
              </label>
              <input
                id="first_name"
                type="text"
                {...formik.getFieldProps("first_name")}
                className={`w-full p-3 border ${
                  formik.touched.first_name && formik.errors.first_name
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-[#d99b2c]`}
                placeholder="Enter your First Name"
              />
              {formik.touched.first_name && formik.errors.first_name && (
                <p style={{color: 'red', fontSize: '12px'}}>{formik.errors.first_name}</p>
              )}
            </div> */}

            {/* Last Name */}
            {/* <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="last_name">
                Last Name
              </label>
              <input
                id="last_name"
                type="text"
                {...formik.getFieldProps("last_name")}
                className={`w-full p-3 border ${
                  formik.touched.last_name && formik.errors.last_name
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-[#d99b2c]`}
                placeholder="Enter your Last Name"
              />
              {formik.touched.last_name && formik.errors.last_name && (
                <p style={{color: 'red', fontSize: '12px'}}>{formik.errors.last_name}</p>
              )}
            </div> */}

            {/* X Handle */}
            {/* <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="xhandle">
                X-Handle
              </label>
              <input
                id="xhandle"
                type="text"
                {...formik.getFieldProps("xhandle")}
                className={`w-full p-3 border ${
                  formik.touched.xhandle && formik.errors.xhandle
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-[#d99b2c]`}
                placeholder="Enter your X-Handle"
              />
              {formik.touched.xhandle && formik.errors.xhandle && (
                <p style={{color: 'red', fontSize: '12px'}}>{formik.errors.xhandle}</p>
              )}
            </div> */}

            {/* Phone Number */}
            {/* <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="phone">
                Phone Number
              </label>
              <PhoneInput
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={setPhoneNumber}
                className="p-3 w-full border border-gray-300 rounded-md"
              />
            </div> */}

            {/* Password */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={newPasswordVisible ? "text" : "password"}
                  {...formik.getFieldProps("password")}
                  className={`w-full p-3 border ${formik.touched.password && formik.errors.password
                    ? "border-red-500"
                    : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-[#d99b2c]`}
                  placeholder="Enter your password"
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

              {formik.touched.password && formik.errors.password && (
                <p style={{ color: 'red', fontSize: '12px' }}>{formik.errors.password}</p>
              )}

              <div>
                <PasswordRequirement isValid={passwordCriteria.hasUpperCase} text="Password should contain a capital letter" />
                <PasswordRequirement isValid={passwordCriteria.hasLowerCase} text="Password should contain a small letter" />
                <PasswordRequirement isValid={passwordCriteria.hasSpecialChar} text="Password should contain a special character" />
                <PasswordRequirement isValid={passwordCriteria.hasNumber} text="Password should contain a number" />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="confirm_password">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirm_password"
                  type={confirmPasswordVisible ? "text" : "password"}
                  {...formik.getFieldProps("confirm_password")}
                  className={`w-full p-3 border ${formik.touched.confirm_password && formik.errors.confirm_password
                    ? "border-red-500"
                    : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-[#d99b2c]`}
                  placeholder="Confirm your password"
                />
                <div
                  onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                >
                  {confirmPasswordVisible ? (
                    <FontAwesomeIcon icon={faEyeSlash} size="1x" color="#ff700c" className="mr-2" />
                  ) : (
                    <FontAwesomeIcon icon={faEye} size="1x" color="#ff700c" className="mr-2" />
                  )}
                </div>
              </div>

              {formik.touched.confirm_password && formik.errors.confirm_password && (
                <p style={{ color: 'red', fontSize: '12px' }}>{formik.errors.confirm_password}</p>
              )}

              <PasswordRequirement isValid={passwordCriteria.matches} text="Password should match" />
            </div>

            {err && <p style={{ color: 'red' }} className="mb-3 mt-3 text-center text-12">{err}</p>}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#d99b2c] via-[#ae6b00] to-[#da8100] text-white py-3 rounded-md transition duration-300"
            >
              {formik.isSubmitting ? 'Signing up...' : 'SIGN UP'}
            </button>
          </form>

          <p className="mt-4 text-center" onClick={() => navigate("/login")}>
            Already have an account?{" "}
            <span className="text-blue-950 cursor-pointer font-bold">Login</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
