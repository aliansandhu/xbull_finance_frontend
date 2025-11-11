import axiosInstance from "../axiosConfiguration";
import {extractErrorMessage} from "../../helpers/extractErrorMessage";

export const userLogin = async (email, password) => {
    try {
        const response = await axiosInstance.post("/login/", {
            email: email,
            password: password,
        });
        return response
    } catch (error) {
        return extractErrorMessage(error)
    }
};
