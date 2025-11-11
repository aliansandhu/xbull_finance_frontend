import axiosInstance from "../axiosConfiguration";
import {extractErrorMessage} from "../../helpers/extractErrorMessage";

export const userVerify = async (uuid) => {
    try {
        const response = await axiosInstance.get(`/verify-user/${uuid}/?format=json`);
        return response
    } catch (error) {
        return extractErrorMessage(error)
    }
};
