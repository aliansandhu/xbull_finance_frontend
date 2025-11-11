import axiosInstance from "../axiosConfiguration";
import {extractErrorMessage} from "../../helpers/extractErrorMessage";

export const getModuleProgress = async (moduleId) => {
    try {
        const response = await axiosInstance.get(`progress/module/${moduleId}/`);
        return response
    } catch (error) {
        return extractErrorMessage(error)
    }
};

export const patchModuleProgress = async (moduleId) => {
    try {
        const response = await axiosInstance.patch(`progress/module/${moduleId}/`);
        return response
    } catch (error) {
        return extractErrorMessage(error)
    }
};
