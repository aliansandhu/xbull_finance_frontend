import axiosInstance from "../axiosConfiguration";
import {extractErrorMessage} from "../../helpers/extractErrorMessage";

export const userSignup = async (email, password, confirm_password, phone, first_name, last_name, xhandle) => {
    try {
        const response = await axiosInstance.post("/signup/", {
            email: email,
            password: password,
            phone_number: phone,
            confirm_password: confirm_password,
            first_name: first_name,
            last_name: last_name,
            x_handle: xhandle
        });
        return response
    } catch (error) {
        return extractErrorMessage(error)
    }
};

export const userRegister = async (email, password, confirm_password) => {
    try {
        const response = await axiosInstance.post("/register-user/", {
            email: email,
            password: password,
            confirm_password: confirm_password,
        });
        return response
    } catch (error) {
        return extractErrorMessage(error)
    }
};
