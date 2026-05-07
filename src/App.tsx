import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import PublicRoute from "./context/PublicRoute";
import ProtectedRoute from "./context/ProtectedRoute";

import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";

import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login"
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResendVerification from "./components/Auth/ResendVerification";
import ResetPassword from "./components/Auth/SetNewPassword";


import Dashboard from "./components/Dashboard";
import { mockDashboardData } from "./components/types/MockData"
import SingleProductPage from "./components/SingleProductPage";
import BulkUploadPage from "./components/BulkUploadJob";
import CreditsPage from "./components/CreditsPage";
import ApiKeysPage from "./components/ApiKeysPage";
import JobHistoryPage from "./components/JobHistoryPage";
import AccountDisabled from "./components/Auth/AccountDisabled";



const App: React.FC = () => {


  return (
    <main>

      <Toaster position="top-right" />
      <Routes>

        {/* Always public — no auth wrapper */}
        <Route element={<AuthLayout />}>
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/account-disabled" element={<AccountDisabled />} />
        </Route>

        {/* Public only — logged-in users bounce to /dashboard */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/signup" element={<Register />} />
            <Route path="/signin" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/resend-verification-email" element={<ResendVerification />} />
          </Route>
        </Route>





        {/* Protected — guests bounce to /signin */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard data={mockDashboardData} />} />
            <Route
              path="/single-product"
              element={
                <SingleProductPage
                  credits={mockDashboardData.creditsRemaining}
                />
              }
            />
            <Route path="/bulk-upload" element={<BulkUploadPage credits={mockDashboardData.creditsRemaining} />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
            <Route path="/api-keys" element={<ApiKeysPage />} />
            <Route path="/job-history" element={<JobHistoryPage />} />

          </Route>
        </Route>
        <Route
          path="/credits"
          element={
            <CreditsPage
              credits={mockDashboardData.creditsRemaining}
              creditsTotal={mockDashboardData.creditsTotal}
            />
          }
        />
        {/* Catch-all — always last */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes >
    </main>



  );
};

export default App;