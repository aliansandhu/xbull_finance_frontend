import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from "./Footer";

const Layout = () => {
    return (
        <div className="w-full min-h-screen h-screen flex flex-col overflow-x-hidden">
            <Header />
            <main className="flex-grow w-full max-w-full">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;


