import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MainDashboard from "./pages/MainDashboard";
import KeamananContent from "./components/KeamananContent";
import { AuthenticationPage } from "./auth/AuthenticationPage";
import UploadContent from "./components/UploadContent";
import NotFound from "./pages/NotFound";
import GraphContent from "./components/GraphContent"; 

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const frontendApi = import.meta.env.VITE_CLERK_FRONTEND_API;

function App() {
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      frontendApi={frontendApi}
      appearance={{
        layout: {
          unsafe_disableDevelopmentModeWarnings: true,
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<AuthenticationPage />} />
          <Route path="/sign-up" element={<AuthenticationPage />} />
          <Route path="/sign-in/sso-callback" element={<AuthenticationPage />} />
          <Route path="/sign-up/sso-callback" element={<AuthenticationPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <>
                <SignedIn>
                  <MainDashboard />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn redirectUrl="/sign-in" />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/keamanan"
            element={
              <>
                <SignedIn>
                  <KeamananContent />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn redirectUrl="/sign-in" />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/upload"
            element={
              <>
                <SignedIn>
                  <UploadContent />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn redirectUrl="/sign-in" />
                </SignedOut>
              </>
            }
          />

          <Route
            path="/graph"
            element={
              <>
                <SignedIn>
                  <GraphContent />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn redirectUrl="/sign-in" />
                </SignedOut>
              </>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;