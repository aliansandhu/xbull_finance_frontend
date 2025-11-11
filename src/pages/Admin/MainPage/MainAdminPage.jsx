import React, { useEffect, useState } from "react";
import XLogo from "../../../assets/images/x_logo.png";
import { deleteUser, getAllUsersList, getCourseProgress, getUsersList } from "../../../apis/AdminAPIs/adminApi";
import { FaTrash } from "react-icons/fa";
import TierCounter from "../../../components/TierCounter/TierCounter";
import { getCourses } from "../../../apis/Module/courses";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

const MainAdminPage = () => {
    const [usersList, setUsersList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0); // total users
    const [pageSize] = useState(10);       // items per page
    const [courseProgress, setCourseProgress] = useState([])
    const [courses, setCourses] = useState([])
    const [openModal, setOpenModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState({})
    const [isDeleting, setIsDeleting] = useState(false)
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [ordering, setOrdering] = useState('')

    const fetchUsers = (pageNum = 1, pageSize = 10) => {
        setIsLoading(true);
        getUsersList(pageNum, pageSize, ordering)
            .then((res) => {
                setUsersList(res?.data?.results || []);
                setCount(res?.data?.count || 0);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    };

    const fetchTierProgress = () => {
        getCourses().then((res) => {
            setCourses(res.data)
        })
    }

    const fetchCourseProgress = () => {
        getCourseProgress().then((res) => {
            setCourseProgress(res?.data?.results || [])
            setIsLoading(false)
        }).catch((err) => {
            setIsLoading(false)
        })
    }

    useEffect(() => {
        fetchUsers(page, ordering);
        fetchCourseProgress()
        fetchTierProgress()
    }, [page, ordering]);

    const members = {};

    courseProgress.forEach(item => {
        if (!members[item.user]) {
            members[item.user] = { user_id: item.user, courseProgress1: 0, courseProgress2: 0 };
        }

        if (item.course === 1) {
            members[item.user].courseProgress1 = item.progress_percentage.progress_percentage;
        }

        if (item.course === 4) {
            members[item.user].courseProgress2 = item.progress_percentage.progress_percentage;
        }
    });
    const membersArray = Object.values(members);

    const totalPages = Math.ceil(count / pageSize);

    const handleUserDelete = async () => {
        setIsDeleting(true)
        try {
            await deleteUser(selectedUser?.id)
            await fetchUsers(page, pageSize, ordering)
        } catch (e) { }
        finally {
            setIsDeleting(false)
            setOpenModal(false)
        }
    }

    const handleSort = (key) => {
        setOrdering(ordering === `${key}` ? `-${key}` : `${key}`)
    };

    const sortedUsers = [...usersList].sort((a, b) => {
        if (!sortConfig.key) return 0;

        const valueA = a[sortConfig.key] ?? "";
        const valueB = b[sortConfig.key] ?? "";

        if (typeof valueA === "string") {
            return sortConfig.direction === "asc"
                ? valueA.localeCompare(valueB)
                : valueB.localeCompare(valueA);
        } else {
            return sortConfig.direction === "asc"
                ? valueA - valueB
                : valueB - valueA;
        }
    });



    const handleCSVDownload = async () => {
        const allUsers = await getAllUsersList();

        if (!allUsers || allUsers.length === 0) {
            alert("No data available to export");
            return;
        }

        const headers = [
            "Email",
            "First Name",
            "Last Name",
            "Phone Number",
            "X-Handle",
            "Last Login",
            "Courses Progress"
        ];

        const rows = allUsers.map((user) => {
            const userProgress = courseProgress.filter((p) => p.user === user.id);

            const progressText = userProgress
                .map(
                    (p) =>
                        `${p.course_title}: ${p.progress_percentage?.progress_percentage || 0}%`
                )
                .join(" | ");

            return [
                user.email || "",
                user.first_name || "",
                user.last_name || "",
                user.phone_number || "",
                user.x_handle || "",
                user.last_login
                    ? new Date(user.last_login).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                    })
                    : "-",
                progressText || "No Progress",
            ];
        });

        const csvContent = [
            headers.join(","),
            ...rows.map((row) =>
                row
                    .map((value) =>
                        `"${String(value).replace(/"/g, '""')}"`
                    )
                    .join(",")
            ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute("download", "users.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };



    {
        isLoading &&
            <div
                role="status"
                className="flex justify-center items-center mt-48"
            >
                <svg
                    aria-hidden="true"
                    className="w-72 h-24 text-gray-200 animate-spin dark:text-white fill-blue-950"
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
                <img
                    src={XLogo}
                    alt="Static Image"
                    className="absolute w-12 h-12"
                />
                <span className="sr-only">Loading...</span>
            </div>
    }

    return (
        <div className="w-full">
            {isLoading ? <div
                role="status"
                className="flex justify-center items-center mt-48"
            >
                <svg
                    aria-hidden="true"
                    className="w-72 h-24 text-gray-200 animate-spin dark:text-white fill-blue-950"
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
                <img
                    src={XLogo}
                    alt="Static Image"
                    className="absolute w-12 h-12"
                />
                <span className="sr-only">Loading...</span>
            </div> : <>
                <div className="mt-4 flex items-center justify-between px-8">
                    <h1 className="font-bold text-2xl">Users</h1>

                    <div className="flex gap-3">
                        <button onClick={handleCSVDownload} className="bg-blue-950 hover:bg-blue-700 px-4 py-2 rounded-lg text-white text-sm font-medium shadow">
                            Export CSV
                        </button>
                    </div>
                </div>


                <div className="p-6 bg-gray-50 min-h-screen flex justify-center items-start w-full">
                    <TierCounter members={membersArray} userCount={count} />
                </div>

                <div>
                    <div className="flex px-8 items-center justify-center overflow-x-auto mt-12">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr className="border-b-2">
                                    <th
                                        className="px-6 py-3 cursor-pointer"
                                        onClick={() => handleSort("email")}
                                    >
                                        <span className="inline-flex items-center gap-1">
                                            Email {ordering === "email" && (ordering.startsWith("-") ? "▼" : "▲")}
                                        </span>
                                    </th>
                                    <th
                                        className="px-6 py-3 cursor-pointer"
                                        onClick={() => handleSort("first_name")}
                                    >
                                        <span className="inline-flex items-center gap-1">
                                            First Name {ordering === "first_name" && (ordering.startsWith("-") ? "▼" : "▲")}
                                        </span>
                                    </th>
                                    <th
                                        className="px-6 py-3 cursor-pointer"
                                        onClick={() => handleSort("last_name")}
                                    >
                                        <span className="inline-flex items-center gap-1">
                                            Last Name {ordering === "last_name" && (ordering.startsWith("-") ? "▼" : "▲")}
                                        </span>
                                    </th>
                                    <th
                                        className="px-6 py-3 cursor-pointer"
                                        onClick={() => handleSort("phone_number")}
                                    >
                                        <span className="inline-flex items-center gap-1">
                                            Phone Number {ordering === "phone_number" && (ordering.startsWith("-") ? "▼" : "▲")}
                                        </span>
                                    </th>
                                    <th
                                        className="px-6 py-3 cursor-pointer"
                                        onClick={() => handleSort("x_handle")}
                                    >
                                        <span className="inline-flex items-center gap-1">
                                            X-Handle {ordering === "x_handle" && (ordering.startsWith("-") ? "▼" : "▲")}
                                        </span>
                                    </th>
                                    <th
                                        className="px-6 py-3 cursor-pointer"
                                        onClick={() => handleSort("last_login")}
                                    >
                                        <span className="inline-flex items-center gap-1">
                                            Last Login {ordering === "last_login" && (ordering.startsWith("-") ? "▼" : "▲")}
                                        </span>
                                    </th>
                                    <th className="px-6 py-3">Action</th>
                                </tr>

                            </thead>
                            <tbody>
                                {sortedUsers?.length > 0 &&
                                    sortedUsers?.map((item) => {
                                        // Find all progress entries for this user
                                        const userProgress = courseProgress.filter(p => p.user === item.id);

                                        return (
                                            <tr
                                                key={item.id}
                                                className="bg-white border-b cursor-pointer hover:bg-blue-100 dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                                            >
                                                <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                    {item?.email}
                                                </th>
                                                <td className="px-6 py-4">{item?.first_name}</td>
                                                <td className="px-6 py-4">{item?.last_name}</td>
                                                <td className="px-6 py-4">{item?.phone_number}</td>
                                                <td className="px-6 py-4">{item?.x_handle}</td>
                                                <td className="px-6 py-4">
                                                    {item?.last_login
                                                        ? new Date(item.last_login).toLocaleString("en-GB", {
                                                            day: "2-digit",
                                                            month: "2-digit",
                                                            year: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: true,
                                                        })
                                                        : "-"}
                                                </td>

                                                {/* 👇 Progress Bar Cell */}
                                                <td className="px-6 py-4">
                                                    {userProgress.length > 0 ? (
                                                        userProgress.map((p) => (
                                                            <div key={p.course} className="mb-3">
                                                                <p className="text-xs font-bold mb-1">{p.course_title}</p>
                                                                <div className="flex items-center">
                                                                    <div className="w-[120px] bg-gray rounded-full h-2.5">
                                                                        <div
                                                                            className="bg-primary h-2.5 rounded-full"
                                                                            style={{ width: `${p.progress_percentage?.progress_percentage || 0}%` }}
                                                                        />
                                                                    </div>
                                                                    <p className="ml-2 text-sm font-bold">
                                                                        {p.progress_percentage?.progress_percentage || 0}%
                                                                    </p>
                                                                </div>
                                                                <p className="text-xs text-gray-500">
                                                                    {p.progress_percentage?.completed ? "Completed" : "In Progress"}
                                                                </p>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-xs text-gray-400">No Progress</p>
                                                    )}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <FaTrash
                                                        onClick={() => {
                                                            setOpenModal(true)
                                                            setSelectedUser((prev) => ({
                                                                ...prev,
                                                                id: item?.id,
                                                                name: item?.first_name
                                                            }))
                                                        }}
                                                        style={{ color: "#a6282e" }}
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>

                        </table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex justify-center mt-6 space-x-2">
                        <button
                            disabled={page === 1}
                            onClick={() => {
                                setIsLoading(true)
                                setPage(page - 1)
                            }}
                            className={`px-3 py-1 rounded-lg ${page === 1 ? "bg-gray-300" : "bg-blue-950 text-white"
                                }`}
                        >
                            Previous
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(
                                (p) =>
                                    p === 1 ||
                                    p === totalPages ||
                                    (p >= page - 1 && p <= page + 1)
                            )
                            .map((p, idx, arr) => {
                                const prevPage = arr[idx - 1];
                                const showEllipsis = prevPage && p - prevPage > 1;

                                return (
                                    <React.Fragment key={p}>
                                        {showEllipsis && (
                                            <span className="px-2 py-1">...</span>
                                        )}
                                        <button
                                            onClick={() => setPage(p)}
                                            className={`px-3 py-1 rounded-lg ${page === p ? "bg-blue-950 text-white" : "bg-gray-200"
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    </React.Fragment>
                                );
                            })}

                        {/* Next */}
                        <button
                            disabled={page === totalPages}
                            onClick={() => {
                                setIsLoading(true)
                                setPage(page + 1)
                            }}
                            className={`px-3 py-1 rounded-lg ${page === totalPages ? "bg-gray-300" : "bg-blue-950 text-white"
                                }`}
                        >
                            Next
                        </button>
                    </div>
                </div>
                <Modal
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    center
                    classNames={{
                        modal: "rounded-xl shadow-lg p-6"
                    }}
                >
                    <h2 className="text-lg font-bold mb-2">Confirm Delete</h2>
                    <p className="text-gray-700">
                        Are you sure you want to delete <span className="font-bold">{selectedUser?.name}</span> user? This action cannot be undone.
                    </p>


                    {/* Footer */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={() => setOpenModal(false)}
                            className="px-4 py-2 rounded-md border text-gray-600 focus:outline-none focus:ring-0"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={() => {
                                handleUserDelete()
                            }}
                            className="px-4 py-2 rounded-md bg-blue-600 text-white bg-blue-950"
                        >
                            {isDeleting ? 'Deleting...' : 'Confirm'}
                        </button>
                    </div>
                </Modal>

            </>}

        </div>
    );
};

export default MainAdminPage;
