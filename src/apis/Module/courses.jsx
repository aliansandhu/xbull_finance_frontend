import axiosInstance from "../axiosConfiguration";
import {extractErrorMessage} from "../../helpers/extractErrorMessage";

export const getCourses = async () => {
    try {
        const response = await axiosInstance.get(`/courses/`);
        return response
    } catch (error) {
        return extractErrorMessage(error)
    }
};
