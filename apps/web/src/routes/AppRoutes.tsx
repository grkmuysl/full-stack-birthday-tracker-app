import { Routes, Route, Navigate } from "react-router-dom";

function LoginPagePlaceholder() {
  return <div>Login page </div>;
}

function DashboardPlaceholder() {
  return <div>Dashboard page</div>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPagePlaceholder />} />
      <Route path="/" element={<DashboardPlaceholder />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
