import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Landing from './pages/LandingPage/Landing';
import Layout from "./components/Layout";
import ModulePage from "./pages/ModulePage/ModulePage";
import LessonDetail from "./pages/LessonDetail/LessonDetail";
import LoginPage from "./pages/Authentication/LoginPage";
import SignUpPage from "./pages/Authentication/SignUpPage";
import ForgotPassword from "./pages/Authentication/ForgotPassword";
import ResetPassword from "./pages/Authentication/ResetPassword";
import EmailVerified from "./pages/Authentication/EmailVerified";
import { ToastContainer } from 'react-toastify';
import QuizPage from "./pages/Quiz/QuizPage";
import TermsConditions from "./pages/Policies/Terms";
import PrivacyPolicy from "./pages/Policies/Policy";
import MainAdminPage from "./pages/Admin/MainPage/MainAdminPage";
import UserCourses from "./pages/Admin/UserCourses/UserCourses";
import LayoutAdmin from "./components/LayoutAdmin";
import UserProfile from "./pages/UserProfile/UserProfile";
import UserProgressDetail from "./pages/Admin/UserProgressDetail/UserProgressDetail";

const App = () => {
    return (
        <>
            <ToastContainer position={'bottom-right'} />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Landing />} />
                        <Route path="course/:id" element={<ModulePage />} />
                        <Route path="module/:moduleId/lesson/:lessonId" element={<LessonDetail />} />
                        <Route path="exam/:moduleId/" element={<QuizPage />} />
                        <Route path="/terms-and-services" element={<TermsConditions />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/profile" element={<UserProfile />} />
                    </Route>
                    <Route path="/admin" element={<LayoutAdmin />}>
                        <Route index element={<MainAdminPage />} />
                        <Route path={'courses'} element={<UserCourses />} />
                        <Route path="user-progress-detail/:courseid/:userid" element={<UserProgressDetail />} />
                    </Route>

                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/verify-user/:uuid" element={<EmailVerified />} />
                    <Route path="/reset-password/:uuid" element={<ResetPassword />} />
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default App;
