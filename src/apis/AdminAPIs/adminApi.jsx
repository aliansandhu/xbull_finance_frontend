import axiosInstance from "../axiosConfiguration";
import {extractErrorMessage} from "../../helpers/extractErrorMessage";

export const getCourseProgress = async (courseId) => {
    try {
        const response = await axiosInstance.get(`/admin-course-progress/`);
        return response
    } catch (error) {
        return extractErrorMessage(error)
    }
};

export const getUsersList = async (page=1, page_size=10, order) => {
    try {
        const response = await axiosInstance.get(`/admin-users-list/?page=${page}&page_size=${page_size}&ordering=${order}`);
        return response
    } catch (error) {
        return extractErrorMessage(error)
    }
};

export const getAllUsersList = async () => {
    try {
        const response = await axiosInstance.get(`/admin-users-list-all/`);
        return response.data
    } catch (error) {
        return extractErrorMessage(error)
    }
};

export const getUserProgressDetail = async (courseId, userId) => {
    try {
        const response = await axiosInstance.get(`/user-progress/${courseId}/${userId}/`);
        return response
    } catch (error) {
        return extractErrorMessage(error)
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await axiosInstance.delete(`/admin-users-list/${id}/`);
        return response
    } catch (error) {
        return extractErrorMessage(error)
    }
};
