export const extractErrorMessage = (error) => {
    let errorResponse = error; // Default message

    if (error.response?.data) {
        for (const key in error.response.data) {
            if (Array.isArray(error.response.data[key]) && error.response.data[key].length > 0) {
                errorResponse = error.response.data[key][0]; // Get the first error message
                break; // Exit loop after finding first error
            }
        }
    }
    return {
        message: errorResponse.response ? errorResponse.response.data.error : errorResponse,
        status: error.response?.status || 500, // Return status or 500 if undefined
    };
};