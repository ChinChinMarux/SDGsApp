// src/App.jsx
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home"; // Tambahkan ini
import Dashboard from "./pages/Dashboard"; // Tambahkan ini jika ada halaman Dashboard
import Dokumen from "./components/DocumentContent"; // Tambahkan ini jika ada halaman Dokumen

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dokumen" element={<Dokumen />} />
          
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;
