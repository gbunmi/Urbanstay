/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner.tsx";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import GeminiAssistant from "./components/GeminiAssistant";

// Pages (Lazy loads or direct imports)
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import PropertiesPage from "./pages/PropertiesPage";
import PropertyDetailsPage from "./pages/PropertyDetailsPage";
import DashboardPage from "./pages/DashboardPage";
import CreateListingPage from "./pages/CreateListingPage";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/auth" />;
  return <>{children}</>;
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/properties" element={<PropertiesPage />} />
              <Route path="/properties/:id" element={<PropertyDetailsPage />} />
              <Route 
                path="/dashboard/*" 
                element={
                  <ProtectedRoute>
                    <Routes>
                      <Route path="/" element={<DashboardPage />} />
                      <Route path="/create-listing" element={<CreateListingPage />} />
                      {/* Other dashboard subroutes can be handled within DashboardPage if preferred, 
                          but adding CreateListing here makes it a top-level dash route */}
                    </Routes>
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
          <Toaster />
          <GeminiAssistant />
        </div>
      </AuthProvider>
    </Router>
  );
}

