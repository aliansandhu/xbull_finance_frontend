import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const storedValue = localStorage.getItem("appState");
    const initialState = storedValue ? JSON.parse(storedValue) : {};

    const [value, setValue] = useState(initialState);

    useEffect(() => {
        localStorage.setItem("appState", JSON.stringify(value));
    }, [value]);

    return (
        <AppContext.Provider value={{ value, setValue }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};
