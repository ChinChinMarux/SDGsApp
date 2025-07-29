import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SignIn, SignUp, SignedIn, SignedOut } from "@clerk/clerk-react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const CustomContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  width: "100%",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
}));

const CustomPaper = styled(Paper)(({ theme }) => ({
  borderRadius: 24,
  display: "flex",
  overflow: "hidden",
  minHeight: 600,
  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  }
}));

const LeftPanel = styled(Box)(({ theme }) => ({
  width: "50%",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  padding: theme.spacing(6),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  [theme.breakpoints.down('md')]: {
    width: "100%",
    minHeight: 300,
    padding: theme.spacing(4),
  }
}));

const RightPanel = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(6),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#fafafa",
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(4),
  }
}));

const LogoCircle = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: "50%",
  backgroundColor: "rgba(255,255,255,0.2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(3),
  fontSize: 36,
  fontWeight: "bold",
}));

const SDGCircle = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  fontSize: 14,
  fontWeight: "bold",
  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-8px) scale(1.1)",
    boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
    zIndex: 10,
  },
}));

const ClerkContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: 400,
  "& .cl-rootBox": {
    width: "100%",
  },
  "& .cl-card": {
    boxShadow: "none",
    backgroundColor: "transparent",
  },
  "& .cl-headerTitle": {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#333",
    marginBottom: theme.spacing(1),
  },
  "& .cl-headerSubtitle": {
    color: "#666",
    fontSize: "1rem",
    marginBottom: theme.spacing(4),
  },
  "& .cl-formFieldInput": {
    borderRadius: "8px",
    backgroundColor: "#f5f5f5",
    height: "48px",
    border: "1px solid #ddd",
    "&:hover": {
      borderColor: "#667eea",
    },
    "&:focus": {
      borderColor: "#667eea",
      boxShadow: "0 0 0 2px rgba(102, 126, 234, 0.1)",
    },
  },
  "& .cl-formFieldLabel": {
    fontWeight: 500,
    color: "#333",
    marginBottom: theme.spacing(1),
  },
  "& .cl-formButtonPrimary": {
    height: "48px",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    textTransform: "none",
    fontSize: "1rem",
    fontWeight: "600",
    "&:hover": {
      background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
    },
  },
  "& .cl-socialButtonsBlockButton": {
    height: "48px",
    borderRadius: "8px",
    borderColor: "#ddd",
    color: "#666",
    textTransform: "none",
    fontSize: "1rem",
    "&:hover": {
      borderColor: "#667eea",
      backgroundColor: "#f8f9ff",
    },
  },
  "& .cl-footerActionLink": {
    color: "#667eea",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

const sdgData = [
  { color: "#E5243B", name: "No Poverty" },
  { color: "#DDA83A", name: "Zero Hunger" },
  { color: "#4C9F38", name: "Good Health and Well-being" },
  { color: "#C5192D", name: "Quality Education" },
  { color: "#FF3A21", name: "Gender Equality" },
  { color: "#26BDE2", name: "Clean Water and Sanitation" },
  { color: "#FCC30B", name: "Affordable and Clean Energy" },
  { color: "#A21942", name: "Decent Work and Economic Growth" },
  { color: "#FD6925", name: "Industry, Innovation and Infrastructure" },
  { color: "#DD1367", name: "Reduced Inequality" },
  { color: "#FD9D24", name: "Sustainable Cities and Communities" },
  { color: "#BF8B2E", name: "Responsible Consumption and Production" },
  { color: "#3F7E44", name: "Climate Action" },
  { color: "#0A97D9", name: "Life Below Water" },
  { color: "#56C02B", name: "Life on Land" },
  { color: "#00689D", name: "Peace and Justice Strong Institutions" },
  { color: "#19486A", name: "Partnerships to achieve the Goal" }
];

export function AuthenticationPage() {
  const navigate = useNavigate();

  return (
    <>
      <SignedIn>
        <RedirectToDashboard />
      </SignedIn>
      <SignedOut>
        <CustomAuthLayout />
      </SignedOut>
    </>
  );
}

function CustomAuthLayout() {
  const currentPath = window.location.pathname;
  const isSignUp = currentPath.includes('/sign-up');

  return (
    <CustomContainer>
      <Container maxWidth="lg">
        <CustomPaper elevation={8}>
          {/* LEFT PANEL */}
          <LeftPanel sx={{ display: { xs: "none", md: "flex" } }}>
            <LogoCircle>
              S
            </LogoCircle>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              SDG Mapping Tools
            </Typography>
            <Typography variant="h6" sx={{ mb: 1, opacity: 0.9 }}>
              Topic Modelling LDA
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 4, 
                opacity: 0.8, 
                maxWidth: 300, 
                lineHeight: 1.6 
              }}
            >
              Analisis dokumen dan pemetaan otomatis ke Sustainable Development Goals
            </Typography>
            <Grid container spacing={1} sx={{ maxWidth: 280 }}>
              {sdgData.map((sdg, index) => (
                <Grid item xs={2} key={index}>
                  <Tooltip title={`SDG ${index + 1}: ${sdg.name}`} placement="top" arrow>
                    <SDGCircle sx={{ backgroundColor: sdg.color }}>
                      {index + 1}
                    </SDGCircle>
                  </Tooltip>
                </Grid>
              ))}
            </Grid>
          </LeftPanel>

          {/* RIGHT PANEL */}
          <RightPanel>
            <ClerkContainer>
              {isSignUp ? (
                <SignUp 
                  path="/sign-up" 
                  routing="path"
                  signInUrl="/sign-in"
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "shadow-none bg-transparent",
                      headerTitle: "text-2xl font-bold text-gray-800 mb-2",
                      headerSubtitle: "text-gray-600 text-base mb-6",
                      formFieldInput: "rounded-lg bg-gray-100 h-12 border border-gray-300 hover:border-blue-500 focus:border-blue-500",
                      formFieldLabel: "font-medium text-gray-800 mb-2",
                      formButtonPrimary: "h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-base font-semibold",
                      socialButtonsBlockButton: "h-12 rounded-lg border-gray-300 text-gray-600 hover:border-blue-500 hover:bg-blue-50",
                      footerActionLink: "text-blue-500 hover:underline",
                    }
                  }}
                />
              ) : (
                <SignIn 
                  path="/sign-in" 
                  routing="path"
                  signUpUrl="/sign-up"
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "shadow-none bg-transparent",
                      headerTitle: "text-2xl font-bold text-gray-800 mb-2",
                      headerSubtitle: "text-gray-600 text-base mb-6",
                      formFieldInput: "rounded-lg bg-gray-100 h-12 border border-gray-300 hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
                      formFieldLabel: "font-medium text-gray-800 mb-2",
                      formButtonPrimary: "h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-base font-semibold",
                      socialButtonsBlockButton: "h-12 rounded-lg border-gray-300 text-gray-600 hover:border-blue-500 hover:bg-blue-50",
                      footerActionLink: "text-blue-500 hover:underline",
                      dividerLine: "bg-gray-300",
                      dividerText: "text-gray-500",
                    }
                  }}
                />
              )}
            </ClerkContainer>
          </RightPanel>
        </CustomPaper>
      </Container>
    </CustomContainer>
  );
}

function RedirectToDashboard() {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate("/dashboard");
  }, [navigate]);

  return (
    <CustomContainer>
      <Box 
        sx={{ 
          textAlign: 'center',
          fontFamily: 'Segoe UI, sans-serif', 
          color: 'white', 
          fontSize: '1.2rem',
          fontWeight: 500
        }}
      >
        You are already signed in. Redirecting to the Dashboard page...
      </Box>
    </CustomContainer>
  );
}