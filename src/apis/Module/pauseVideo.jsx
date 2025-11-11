import axiosInstance from "../axiosConfiguration";
import {extractErrorMessage} from "../../helpers/extractErrorMessage";

export const pauseVideo = async (videoId, isCompleted, seconds) => {
    const id = parseInt(videoId)
    try {
        const response = await axiosInstance.patch(`/progress/video/${id}/`, {
            completed: isCompleted,
            watched_seconds: seconds
        });
        return response
    } catch (error) {
        return extractErrorMessage(error)
    }
};
