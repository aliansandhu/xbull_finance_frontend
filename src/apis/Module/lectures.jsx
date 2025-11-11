import axiosInstance, { axiosInstanceWithoutToken } from "../axiosConfiguration";
import {extractErrorMessage} from "../../helpers/extractErrorMessage";

export const getLectures = async (moduleId) => {
    const id = parseInt(moduleId)
    try {
        const response = await axiosInstanceWithoutToken.get(`/lectures/${id}/`);
        return response
    } catch (error) {
        return extractErrorMessage(error)
    }
};


// export const getVideoLecture = async (videoId) => {
//     const id = parseInt(videoId)
//     try{
//         const response = await axiosInstance.get(`stream-video/${id}`);
//         return response
//     } catch (e) {
//         return extractErrorMessage(e)
//     }
// }