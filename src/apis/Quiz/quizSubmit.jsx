import axiosInstance from "../axiosConfiguration";
import {extractErrorMessage} from "../../helpers/extractErrorMessage";

export const quizSubmit = async (moduleId, answers, quizId) => {
    try {
        const response = await axiosInstance.post(`modules/${moduleId}/quiz/submit/`, {
            answers: answers,
            quiz_id: quizId
        });
        return response
    } catch (error) {
        return extractErrorMessage(error)
    }
};
