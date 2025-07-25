// src/App.jsx
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home"; // Tambahkan ini
import MainDashboard from "./pages/MainDashboard"; // Tambahkan ini jika ada halaman Dashboard
import ProfileContent from "./components/ProfileContent"; // Tambahkan ini jika ada halaman Profile


const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />2
          <Route path="/dashboard" element={<MainDashboard />} />
          <Route path="/profile" element={<ProfileContent />} />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;
