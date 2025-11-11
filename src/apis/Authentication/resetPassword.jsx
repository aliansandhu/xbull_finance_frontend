import axiosInstance from "../axiosConfiguration";
import {extractErrorMessage} from "../../helpers/extractErrorMessage";

export const resetPassword = async (object) => {
    try {
        const response = await axiosInstance.post(`/reset-password/${object.uuid}/`, {
            password: object.password,
            confirm_password: object.confirm_password
        });
        return response
    } catch (error) {
        return extractErrorMessage(error)
    }
};
