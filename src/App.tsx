import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";

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



const App: React.FC = () => {


  return (
    <main>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<Register />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/resend-verification-email" element={<ResendVerification />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>


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
        <Route
          path="/credits"
          element={
            <CreditsPage
              credits={mockDashboardData.creditsRemaining}
              creditsTotal={mockDashboardData.creditsTotal}
            />
          }
        />
      </Routes >
    </main>



  );
};

export default App;