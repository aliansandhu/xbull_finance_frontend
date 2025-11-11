import axiosInstance from "../axiosConfiguration";
import {extractErrorMessage} from "../../helpers/extractErrorMessage";

export const videoComplete = async (videoId, seconds) => {
    const id = parseInt(videoId)
    try {
        const response = await axiosInstance.patch(`/progress/video/${id}/`, {
            complete: true
        });
        return response
    } catch (error) {
        return extractErrorMessage(error)
    }
};