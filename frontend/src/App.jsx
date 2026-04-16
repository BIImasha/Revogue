import React from "react";
import { Routes, Route } from "react-router-dom";

import Homepage from "./pages/homepage";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Items from "./pages/items";
import Upload from "./pages/upload";
import Requests from "./pages/requests";
import Profile from "./pages/profile";
import ForgotPassword from "./pages/forgot_password";

// Our security guard component
import ProtectedRoute from "./components/ProtectedRoute";
import Admin          from "./pages/admin";

function App() {
  return (
    <Routes>

      {/* ── PUBLIC ROUTES ──────────────────────────────── */}
      <Route path="/"                element={<Homepage />} />
      <Route path="/login"           element={<Login />} />
      <Route path="/signup"          element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* ── SEMI PUBLIC (items visible but request needs login) ── */}
      <Route path="/items"           element={<Items />} />

      {/* ── PROTECTED ROUTES ───────────────────────────── */}
      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <Upload />
          </ProtectedRoute>
        }
      />

      <Route
        path="/requests"
        element={
          <ProtectedRoute>
            <Requests />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;