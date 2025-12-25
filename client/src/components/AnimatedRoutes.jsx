import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from '../pages/Home';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import AdminDashboard from '../pages/AdminDashboard';
import AdminLayout from './AdminLayout';
import TeacherDashboard from '../pages/TeacherDashboard';
import TeacherLayout from './TeacherLayout';
import ProtectedRoute from './ProtectedRoute';

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                
                {/* Admin Routes - Protected */}
                <Route path="/admin/*" element={
                    <ProtectedRoute requiredRole="admin">
                        <AdminLayout>
                            <Routes>
                                <Route path="/" element={<AdminDashboard />} />
                                <Route path="/students" element={<AdminDashboard viewMode="students" />} />
                                <Route path="/results" element={<AdminDashboard viewMode="results" />} />
                                <Route path="/entry" element={<AdminDashboard viewMode="entry" />} />
                                <Route path="/reports" element={<AdminDashboard viewMode="reports" />} />
                                <Route path="/bulk-upload" element={<AdminDashboard viewMode="bulkUpload" />} />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </AdminLayout>
                    </ProtectedRoute>
                } />
                
                {/* Teacher Routes - Protected */}
                <Route path="/teacher/*" element={
                    <ProtectedRoute requiredRole="teacher">
                        <TeacherLayout>
                            <Routes>
                                <Route path="/" element={<TeacherDashboard viewMode="dashboard" />} />
                                <Route path="/students" element={<TeacherDashboard viewMode="students" />} />
                                <Route path="/results" element={<TeacherDashboard viewMode="results" />} />
                                <Route path="/entry" element={<TeacherDashboard viewMode="entry" />} />
                                <Route path="/reports" element={<TeacherDashboard viewMode="reports" />} />
                                <Route path="/bulk-upload" element={<TeacherDashboard viewMode="bulkUpload" />} />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </TeacherLayout>
                    </ProtectedRoute>
                } />

                {/* Catch-all for 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </AnimatePresence>
    );
};

export default AnimatedRoutes;
