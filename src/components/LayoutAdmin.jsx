import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import SideBar from "./SideBar";

const Layout = () => {
    return (
        <div className="w-full h-screen flex overflow-hidden">
            {/* Sidebar */}
            <SideBar />

            {/* Main Content Area */}
            <div className="flex-1 overflow-auto" style={{marginLeft: '63px'}}>
                {/* Header */}
                <Header className={"fixed"}/>
                <div className="w-full max-w-full overflow-x-hidden">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;
