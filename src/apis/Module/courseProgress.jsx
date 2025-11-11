import axiosInstance from "../axiosConfiguration";
import {extractErrorMessage} from "../../helpers/extractErrorMessage";

export const updateCourseProgress = async (courseId) => {
    try {
        const response = await axiosInstance.patch(`/progress/course/${courseId}/`);
        return response
    } catch (error) {
        return extractErrorMessage(error)
    }
};
