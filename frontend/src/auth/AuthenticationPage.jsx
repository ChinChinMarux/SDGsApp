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
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SchoolIcon from '@mui/icons-material/School';
import WcIcon from '@mui/icons-material/Wc';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import BoltIcon from '@mui/icons-material/Bolt';
import WorkIcon from '@mui/icons-material/Work';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloudIcon from '@mui/icons-material/Cloud';
import WavesIcon from '@mui/icons-material/Waves';
import ForestIcon from '@mui/icons-material/Forest';
import GavelIcon from '@mui/icons-material/Gavel';
import HandshakeIcon from '@mui/icons-material/Handshake';


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
    backgroundColor: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
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
  // PENTING: Jangan override loading states dan spinner dari Clerk
  "& .cl-spinner": {
    display: "block !important",
    visibility: "visible !important",
    opacity: "1 !important",
  },
  "& .cl-loading": {
    display: "flex !important",
    visibility: "visible !important",
    opacity: "1 !important",
  },
  // Pastikan overlay loading terlihat
  "& .cl-modalBackdrop": {
    display: "flex !important",
    visibility: "visible !important",
    opacity: "1 !important",
    zIndex: "9999 !important",
  },
  // Loading content harus terlihat
  "& .cl-loadingBox": {
    display: "flex !important",
    visibility: "visible !important",
    opacity: "1 !important",
  }
}));

const sdgData = [
  { color: "#E5243B", icon: <VolunteerActivismIcon />, name: "No Poverty" },
  { color: "#DDA83A", icon: <RestaurantIcon />, name: "Zero Hunger" },
  { color: "#4C9F38", icon: <LocalHospitalIcon />, name: "Good Health and Well-being" },
  { color: "#C5192D", icon: <SchoolIcon />, name: "Quality Education" },
  { color: "#FF3A21", icon: <WcIcon />, name: "Gender Equality" },
  { color: "#26BDE2", icon: <WaterDropIcon />, name: "Clean Water and Sanitation" },
  { color: "#FCC30B", icon: <BoltIcon />, name: "Affordable and Clean Energy" },
  { color: "#A21942", icon: <WorkIcon />, name: "Decent Work and Economic Growth" },
  { color: "#FD6925", icon: <PrecisionManufacturingIcon />, name: "Industry, Innovation and Infrastructure" },
  { color: "#DD1367", icon: <Diversity3Icon />, name: "Reduced Inequality" },
  { color: "#FD9D24", icon: <LocationCityIcon />, name: "Sustainable Cities and Communities" },
  { color: "#BF8B2E", icon: <ShoppingCartIcon />, name: "Responsible Consumption and Production" },
  { color: "#3F7E44", icon: <CloudIcon />, name: "Climate Action" },
  { color: "#0A97D9", icon: <WavesIcon />, name: "Life Below Water" },
  { color: "#56C02B", icon: <ForestIcon />, name: "Life on Land" },
  { color: "#00689D", icon: <GavelIcon />, name: "Peace and Justice Strong Institutions" },
  { color: "#19486A", icon: <HandshakeIcon />, name: "Partnerships to achieve the Goal" }
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
  const isCallback = currentPath.includes('/sso-callback');

  // Jika ini adalah callback SSO, tampilkan loading saja
  if (isCallback) {
    return (
      <CustomContainer>
        <Box 
          sx={{ 
            textAlign: 'center',
            fontFamily: 'Segoe UI, sans-serif', 
            color: 'white', 
            fontSize: '1.2rem',
            fontWeight: 500,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              border: '4px solid rgba(255,255,255,0.3)',
              borderTop: '4px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              }
            }}
          />
          Processing sign-in...
        </Box>
      </CustomContainer>
    );
  }

  // Appearance configuration yang lebih aman untuk SSO
  const baseAppearance = {
    elements: {
      rootBox: "w-full",
      card: "transparent",
      headerTitle: "text-2xl font-bold text-gray-800 mb-2",
      headerSubtitle: "text-gray-600 text-base mb-6",
      formFieldInput: "rounded-lg bg-gray-100 h-12 border border-gray-300 hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
      formFieldLabel: "font-medium text-gray-800 mb-2",
      formButtonPrimary: "h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-base font-semibold",
      socialButtonsBlockButton: "h-12 rounded-lg border-gray-300 text-gray-600 hover:border-blue-500 hover:bg-blue-50",
      footerActionLink: "text-blue-500 hover:underline",
      dividerLine: "bg-gray-300",
      dividerText: "text-gray-500",
      // JANGAN override elemen loading ini
      spinner: "", // Biarkan kosong agar menggunakan default
      loading: "", // Biarkan kosong agar menggunakan default
      modalBackdrop: "", // Biarkan kosong agar menggunakan default
      loadingBox: "", // Biarkan kosong agar menggunakan default
    }
  };

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
                        {sdg.icon}
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
                  routing="hash"
                  signInUrl="/sign-in"
                  appearance={baseAppearance}
                  afterSignUpUrl="/dashboard"
                />
              ) : (
                <SignIn 
                  routing="hash"
                  signUpUrl="/sign-up"
                  appearance={baseAppearance}
                  afterSignInUrl="/dashboard"
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