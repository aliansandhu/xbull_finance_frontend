import axiosInstance from "../axiosConfiguration";
import {extractErrorMessage} from "../../helpers/extractErrorMessage";

export const getQuizQuestion = async (moduleId) => {
    try {
        const response = await axiosInstance.get(`modules/${moduleId}/quiz/`);
        return response
    } catch (error) {
        return extractErrorMessage(error)
    }
};

export const getNextQuizQuestion = async (moduleId) => {
    try {
        const response = await axiosInstance.get(`/module/${moduleId}/next-quiz/`);
        return response
    } catch (error) {
        return extractErrorMessage(error)
    }
};
