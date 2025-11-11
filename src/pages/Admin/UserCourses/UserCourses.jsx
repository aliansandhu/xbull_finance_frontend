import React, {useEffect, useState} from 'react'
import XLogo from '../../../assets/images/x_logo.png'
import {getCourseProgress, getUserProgressDetail} from "../../../apis/AdminAPIs/adminApi";
import {useNavigate} from "react-router-dom";

const UserCourses = () => {

    const [courseProgress, setCourseProgress] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const navigate = useNavigate()

    useEffect(() => {
        getCourseProgress().then((res) => {
            setCourseProgress(res?.data?.results || [])
            setIsLoading(false)
        }).catch((err) => {
            setIsLoading(false)
        })
    }, []);

    const handleRowClick = (item) => {
        navigate(`/admin/user-progress-detail/${item.course}/${item.user}`);
    }

    return(
        <div className="w-full">
            <div className={'mt-4 justify-between flex px-8'}>
                <h1 className={'font-bold text-24'}>Course Progress</h1>
                {/*<button className={'bg-blue-950 px-3 rounded-lg text-white'}>+ Add User</button>*/}
            </div>
            <div>
                <div className="flex px-8 items-center justify-center overflow-x-auto mt-12">
                    <table
                        className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead
                            className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr className={'border-b-2'}>
                            <th scope="col" className="px-6 py-3">
                                Course Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                User
                            </th>
                            <th scope="col" className="px-6 py-3">
                                User Progress
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Completed
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {courseProgress?.length > 0 && courseProgress?.map((item) => {
                            return (
                                <tr className="bg-white border-b cursor-pointer hover:bg-blue-100 dark:bg-gray-800 dark:border-gray-700 border-gray-200" onClick={() => {
                                    handleRowClick(item)
                                }}>
                                    <td
                                        className="px-6 py-4 text-gray-900 whitespace-nowrap">
                                        {item?.course_title}
                                    </td>
                                    <td className="px-6 py-4">
                                        {item?.user_name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={'px-0 mt-4 flex'}>
                                            <div className="w-[95%] bg-gray rounded-full h-2.5 dark:bg-gray">
                                                <div className="bg-primary h-2.5 rounded-full"
                                                     style={{width: `${item?.progress_percentage?.progress_percentage}%`}}></div>
                                            </div>
                                            <p className={'mt-[-8px] font-bold ml-2'}>{item?.progress_percentage?.progress_percentage}%</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {item?.progress_percentage?.completed === false ? "False" : 'True'}
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
                {isLoading && <div role="status"
                                   className="flex justify-center items-center mt-48"> {/* Set height to full screen */}
                    <svg
                        aria-hidden="true"
                        className="w-72 h-24 text-gray-200 animate-spin dark:text-white fill-blue-950" // Increased size to w-24 h-24
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                        />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                        />
                    </svg>
                    {/* Static Image Overlay */}
                    <img
                        src={XLogo}
                        alt="Static Image"
                        className="absolute w-12 h-12" // Adjust size as needed
                    />
                    <span className="sr-only">Loading...</span>
                </div>}
            </div>

        </div>
    )
}
export default UserCourses