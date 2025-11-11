import axiosInstance from "../axiosConfiguration";
import {extractErrorMessage} from "../../helpers/extractErrorMessage";

export const getVideoProgress = async (id) => {
    try {
        const response = await axiosInstance.get(`progress/video/${id}/`);
        return response
    } catch (error) {
        return extractErrorMessage(error)
    }
};
