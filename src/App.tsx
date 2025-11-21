import React from "react";
import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

import ClientDashboard from "./pages/ClientDashboard";
import SupplierDashboard from "./pages/SupplierDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsersPage from "./pages/AdminUsersPage";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";
import NotFoundPage from "./pages/NotFoundPage";

import type { UserRole } from "./context/AuthContext";

const App: React.FC = () => {
  return (
    <Routes>

      {/* דף בית */}
      <Route path="/" element={<HomePage />} />

      {/* התחברות/הרשמה */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Client Protected Wrapper */}
      <Route element={<ProtectedRoute allowedRoles={["Client" as UserRole]} />}>
        <Route
          path="/client"
          element={
            <MainLayout>
              <ClientDashboard />
            </MainLayout>
          }
        />
      </Route>

      {/* Supplier Protected Wrapper */}
      <Route element={<ProtectedRoute allowedRoles={["Supplier" as UserRole]} />}>
        <Route
          path="/supplier"
          element={
            <MainLayout>
              <SupplierDashboard />
            </MainLayout>
          }
        />
      </Route>

      {/* Admin Protected Wrapper */}
      <Route element={<ProtectedRoute allowedRoles={["Admin" as UserRole]} />}>
        <Route
          path="/admin"
          element={
            <MainLayout>
              <AdminDashboard />
            </MainLayout>
          }
        />

        <Route
          path="/admin/users"
          element={
            <MainLayout>
              <AdminUsersPage />
            </MainLayout>
          }
        />
      </Route>

      {/* ברירת מחדל */}
      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  );
};

export default App;
