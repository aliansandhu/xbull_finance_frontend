import axiosInstance from "../axiosConfiguration";
import {extractErrorMessage} from "../../helpers/extractErrorMessage";

export const getModules = async (courseId) => {
    try {
        const response = await axiosInstance.get(`/modules/${courseId}/`);
        return response
    } catch (error) {
        return extractErrorMessage(error)
    }
};
