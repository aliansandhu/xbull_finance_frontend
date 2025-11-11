import React, {useEffect, useState} from 'react'
import {getUserProgressDetail} from "../../../apis/AdminAPIs/adminApi";
import {useParams} from "react-router-dom";
import { FaBook, FaVideo } from 'react-icons/fa'; // Importing icons


const UserProgressDetail = () => {

    const params = useParams()
    const {courseid, userid} = params

    const [data, setData] = useState({})

    useEffect(() => {
        getUserProgressDetail(courseid, userid).then((res) => {
            setData(res?.data)
        })
    }, []);

    return(
        <div className={'px-8'}>
            <div className={'flex py-8'}>
                <p className={'font-bold mr-2 text-20'}>User Course:</p>
                <p className={'text-20'}>{data?.course}</p>
            </div>
            <div className={'flex py-5'}>
                <div className={'flex'}>
                    <p className={'font-bold mr-2 text-20'}>User Email:</p>
                    <p className={'text-20'}>{data?.user?.email}</p>
                </div>
                <div className={'flex ml-12'}>
                    <p className={'font-bold mr-2 text-20'}>X-Handle:</p>
                    <p className={'text-20'}>{data?.user?.x_handle === null ? 'N/A' : data?.user?.x_handle}</p>
                </div>
                <div className={'flex ml-12'}>
                    <p className={'font-bold mr-2 text-20'}>Name:</p>
                    <p className={'text-20'}>{data?.user?.name === ("" || " ") ? 'N/A' : data?.user?.name}</p>
                </div>
            </div>
            <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 py-4 md:space-x-4 mt-8">
                <div className="flex-1 bg-white shadow-lg rounded-lg p-4 h-64">
                    <div className={'flex'}>
                        <FaBook className="text-32 font-bold mr-4 mt-2 text-primary"/>
                        <h2 className="text-32 font-bold" style={{color: '#172554'}}>Module Progress</h2>
                    </div>
                    <div className={'flex'}>
                        <p className={'mt-8 font-bold text-16 mr-4'} style={{color: '#172554'}}>Total Modules:</p>
                        <p className="mt-8 text-17">{data?.module_progress?.total_modules}</p>
                    </div>
                    <div className={'flex'}>
                        <p className={'mt-8 font-bold text-16 mr-4'} style={{color: '#172554'}}>Completed Modules:</p>
                        <p className="mt-8 text-17">{data?.module_progress?.completed_modules}</p>
                    </div>
                    <div className={'flex'}>
                        <p className={'mt-8 font-bold text-16 mr-4'} style={{color: '#172554'}}>Module Percentage:</p>
                        <p className="mt-8 text-17">{data?.module_progress?.module_percentage} %</p>
                    </div>
                </div>
                <div className="flex-1 bg-white shadow-lg rounded-lg p-4 h-64">
                    <div className={'flex'}>
                        <FaVideo className="text-32 font-bold mr-4 mt-2 text-primary"/>
                        <h2 className="text-32 font-bold" style={{color: '#172554'}}>Video Progress</h2>
                    </div>
                    <div className={'flex'}>
                        <p className={'mt-8 font-bold text-16 mr-4'} style={{color: '#172554'}}>Total Videos:</p>
                        <p className="mt-8 text-17">{data?.video_progress?.total_videos}</p>
                    </div>
                    <div className={'flex'}>
                        <p className={'mt-8 font-bold text-16 mr-4'} style={{color: '#172554'}}>Completed Videos:</p>
                        <p className="mt-8 text-17">{data?.video_progress?.completed_videos}</p>
                    </div>
                    <div className={'flex'}>
                        <p className={'mt-8 font-bold text-16 mr-4'} style={{color: '#172554'}}>Video Percentage:</p>
                        <p className="mt-8 text-17">{data?.video_progress?.video_percentage} %</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProgressDetail