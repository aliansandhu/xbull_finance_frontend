import axiosInstance from "../axiosConfiguration";
import {extractErrorMessage} from "../../helpers/extractErrorMessage";

export const forgotPassword = async (email) => {
    try {
        const response = await axiosInstance.post("/forgot-password/", {
            email: email,
        });
        return response
    } catch (error) {
        return extractErrorMessage(error)
    }
};
