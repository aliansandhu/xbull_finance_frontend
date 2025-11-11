import axiosInstance from "../axiosConfiguration";
import {extractErrorMessage} from "../../helpers/extractErrorMessage";

export const updateProfile = async (values) => {
    try {
        const response = await axiosInstance.patch("/profile/", {
            email: values.email,
            phone_number: values.phone_number,
            first_name: values.first_name,
            last_name: values.last_name,
            address: values.address,
            city: values.city,
            state: values.state,
            zip_code: values.zip_code,
            x_handle: values.x_handle
        });
        return response
    } catch (error) {
        return extractErrorMessage(error)
    }
};

export const updatePassword = async (values) => {
    try {
        const response = await axiosInstance.patch("/password-reset/", {
            new_password: values.password,
            confirm_password: values.confirm_password,
        });
        return response
    } catch (error) {
        return extractErrorMessage(error)
    }
};