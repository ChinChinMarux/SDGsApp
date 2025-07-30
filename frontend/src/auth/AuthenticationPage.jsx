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
  useMediaQuery,
  useTheme,
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
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1),
    alignItems: "flex-start",
    paddingTop: theme.spacing(2),
  }
}));

const CustomPaper = styled(Paper)(({ theme }) => ({
  borderRadius: 24,
  display: "flex",
  overflow: "hidden",
  minHeight: 600,
  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    minHeight: 'auto',
    width: '100%',
    maxWidth: '100%',
    borderRadius: 16,
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
    minHeight: 'auto',
    padding: theme.spacing(3),
    paddingBottom: theme.spacing(2),
  }
}));

// const RightPanel = styled(Box)(({ theme }) => ({
//   flex: 1,
//   padding: theme.spacing(6),
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   backgroundColor: "white",
//   [theme.breakpoints.down('md')]: {
//     padding: theme.spacing(3),
//     paddingTop: theme.spacing(2),
//   }
// }));

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
  [theme.breakpoints.down('md')]: {
    width: 60,
    height: 60,
    fontSize: 28,
    marginBottom: theme.spacing(2),
  }
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
  [theme.breakpoints.down('md')]: {
    width: 30,
    height: 30,
    fontSize: 12,
    "&:hover": {
      transform: "translateY(-4px) scale(1.05)",
    },
  }
}));

const ClerkContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: 400,
  "& .cl-rootBox": {
    width: "100%",
  },
  "& .cl-card": {
    boxShadow: "none",
    backgroundColor: "#fafafa",
  },
  "& .cl-headerTitle": {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#333",
    marginBottom: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
      fontSize: "1.5rem",
    }
  },
  "& .cl-headerSubtitle": {
    color: "#666",
    fontSize: "1rem",
    marginBottom: theme.spacing(4),
    [theme.breakpoints.down('md')]: {
      fontSize: "0.9rem",
      marginBottom: theme.spacing(3),
    }
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
    [theme.breakpoints.down('md')]: {
      height: "44px",
      fontSize: "16px", // Prevent zoom on iOS
    }
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
    [theme.breakpoints.down('md')]: {
      height: "44px",
      fontSize: "0.9rem",
    }
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
    [theme.breakpoints.down('md')]: {
      height: "44px",
      fontSize: "0.9rem",
    }
  },
  "& .cl-footerActionLink": {
    color: "#667eea",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  // Loading states tetap sama
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
  "& .cl-modalBackdrop": {
    display: "flex !important",
    visibility: "visible !important",
    opacity: "1 !important",
    zIndex: "9999 !important",
  },
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const currentPath = window.location.pathname;
  const isSignUp = currentPath.includes('/sign-up');
  const isCallback = currentPath.includes('/sso-callback');

  // Callback SSO loading tetap sama
  if (isCallback) {
    return (
      <CustomContainer>
        <Box 
          sx={{ 
            textAlign: 'center',
            fontFamily: 'Segoe UI, sans-serif', 
            color: 'white', 
            fontSize: isMobile ? '1rem' : '1.2rem',
            fontWeight: 500,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Box
            sx={{
              width: isMobile ? 32 : 40,
              height: isMobile ? 32 : 40,
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

  // Appearance configuration tetap sama
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
      spinner: "",
      loading: "",
      modalBackdrop: "",
      loadingBox: "",
    }
  };

  return (
    <CustomContainer>
      <Container maxWidth="lg" sx={{ width: '850px' }}>
        <CustomPaper elevation={8}>
          {/* LEFT PANEL - Selalu tampil di mobile (di atas) */}
          <LeftPanel>
            <LogoCircle>
              S
            </LogoCircle>
            <Typography 
              variant={isMobile ? "h5" : "h4"} 
              fontWeight="bold" 
              gutterBottom
              sx={{ fontSize: isMobile ? '1.5rem' : '2.125rem' }}
            >
              SDG Mapping Tools
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: isMobile ? 2 : 4, 
                opacity: 0.8, 
                maxWidth: isMobile ? 280 : 300, 
                lineHeight: 1.6,
                fontSize: isMobile ? '0.9rem' : '1rem'
              }}
            >
              Aplikasi pemetaan publikasi ke dalam topik SDGs dan visualisasi menggunakan Knowledge Graph.
            </Typography>
            <Grid 
              container 
              spacing={isMobile ? 0.5 : 1} 
              sx={{ 
                maxWidth: isMobile ? 240 : 280,
                justifyContent: 'center'
              }}
            >
              {sdgData.map((sdg, index) => (
                <Grid item xs={isMobile ? 1.5 : 2} key={index}>
                  <Tooltip title={`SDG ${index + 1}: ${sdg.name}`} placement="top" arrow>
                    <SDGCircle sx={{ backgroundColor: sdg.color }}>
                      {React.cloneElement(sdg.icon, { 
                        fontSize: isMobile ? 'small' : 'medium' 
                      })}
                    </SDGCircle>
                  </Tooltip>
                </Grid>
              ))}
            </Grid>
          </LeftPanel>

          {/* RIGHT PANEL - Form login/register */}
          {/* <RightPanel> */}
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
          {/* </RightPanel> */}
        </CustomPaper>
      </Container>
    </CustomContainer>
  );
}

function RedirectToDashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
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
          fontSize: isMobile ? '1rem' : '1.2rem',
          fontWeight: 500,
          padding: 2
        }}
      >
        You are already signed in. Redirecting to the Dashboard page...
      </Box>
    </CustomContainer>
  );
}