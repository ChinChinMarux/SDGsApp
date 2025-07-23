import React, { useState } from "react";
import { SignUp } from "@clerk/clerk-react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  // SDG colors array dengan nama-nama SDG
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

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleGoogleSignUp = () => {
    // Handle Google sign up logic here
    console.log("Google sign up clicked");
  };

  return (
    <Container maxWidth="lg" sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          borderRadius: 3,
          display: "flex",
          overflow: "hidden",
          minHeight: 600,
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        }}
      >
        {/* Left Side: SDG Mapping Branding */}
        <Box
          sx={{
            width: "50%",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            p: 6,
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            position: "relative",
          }}
        >
          {/* Logo Circle */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
              fontSize: 36,
              fontWeight: "bold",
            }}
          >
            S
          </Box>

          {/* Title */}
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            gutterBottom
            sx={{ mb: 2 }}
          >
            SDG Mapping Tools
          </Typography>

          {/* Subtitle */}
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 1,
              fontWeight: 500,
              opacity: 0.9 
            }}
          >
            Topic Modelling LDA
          </Typography>

          {/* Description */}
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

          {/* SDG Color Circles */}
          <Grid container spacing={1} sx={{ maxWidth: 280 }}>
            {sdgData.map((sdg, index) => (
              <Grid item xs={2} key={index}>
                <Tooltip 
                  title={`SDG ${index + 1}: ${sdg.name}`}
                  placement="top"
                  arrow
                  componentsProps={{
                    tooltip: {
                      sx: {
                        bgcolor: 'rgba(0,0,0,0.8)',
                        color: 'white',
                        fontSize: '12px',
                        maxWidth: 200,
                        textAlign: 'center',
                        '& .MuiTooltip-arrow': {
                          color: 'rgba(0,0,0,0.8)',
                        },
                      },
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      bgcolor: sdg.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: 14,
                      fontWeight: "bold",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                      cursor: "pointer",
                      transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                      "&:hover": {
                        transform: "translateY(-8px) scale(1.1)",
                        boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
                        zIndex: 10,
                      },
                    }}
                  >
                    {index + 1}
                  </Box>
                </Tooltip>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Right Side: Registration Form */}
        <Box
          sx={{
            flex: 1,
            p: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#fafafa",
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 400 }}>
            <Typography 
              variant="h4" 
              fontWeight="bold" 
              gutterBottom
              sx={{ mb: 1, color: "#333" }}
            >
              Daftarkan Diri,
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 4, 
                color: "#666",
                fontSize: 16
              }}
            >
              Bersiap untuk akses ke sistem SDGS Mapping!
            </Typography>

            <Box component="form">
              {/* Username Field */}
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  fontWeight: "500",
                  color: "#333",
                }}
              >
                Username
              </Typography>
              <TextField
                fullWidth
                placeholder="Masukkan username Anda"
                variant="outlined"
                value={formData.username}
                onChange={handleInputChange('username')}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#f5f5f5",
                    height: 48,
                    "& fieldset": {
                      borderColor: "transparent",
                    },
                    "&:hover fieldset": {
                      borderColor: "#667eea",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#667eea",
                    },
                  },
                }}
              />

              {/* Email Field */}
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  fontWeight: "500",
                  color: "#333",
                }}
              >
                Email
              </Typography>
              <TextField
                fullWidth
                type="email"
                placeholder="Masukkan email Anda"
                variant="outlined"
                value={formData.email}
                onChange={handleInputChange('email')}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#f5f5f5",
                    height: 48,
                    "& fieldset": {
                      borderColor: "transparent",
                    },
                    "&:hover fieldset": {
                      borderColor: "#667eea",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#667eea",
                    },
                  },
                }}
              />

              {/* Password Field */}
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  fontWeight: "500",
                  color: "#333",
                }}
              >
                Kata Sandi
              </Typography>
              <TextField
                fullWidth
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan kata sandi Anda"
                variant="outlined"
                value={formData.password}
                onChange={handleInputChange('password')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#f5f5f5",
                    height: 48,
                    "& fieldset": {
                      borderColor: "transparent",
                    },
                    "&:hover fieldset": {
                      borderColor: "#667eea",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#667eea",
                    },
                  },
                }}
              />

              {/* Confirm Password Field */}
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  fontWeight: "500",
                  color: "#333",
                }}
              >
                Konfirmasi Kata Sandi
              </Typography>
              <TextField
                fullWidth
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Konfirmasi kata sandi Anda"
                variant="outlined"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        size="small"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#f5f5f5",
                    height: 48,
                    "& fieldset": {
                      borderColor: "transparent",
                    },
                    "&:hover fieldset": {
                      borderColor: "#667eea",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#667eea",
                    },
                  },
                }}
              />

              {/* Register Button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  height: 48,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: "600",
                  mb: 3,
                  "&:hover": {
                    background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                  },
                }}
              >
                Daftar
              </Button>

              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Typography variant="body2" color="#666">
                  atau daftar dengan
                </Typography>
              </Box>

              {/* Google Sign Up Button */}
              <Button
                variant="outlined"
                fullWidth
                startIcon={<GoogleIcon />}
                onClick={handleGoogleSignUp}
                sx={{
                  height: 48,
                  borderRadius: 2,
                  borderColor: "#ddd",
                  color: "#666",
                  textTransform: "none",
                  fontSize: "1rem",
                  mb: 3,
                  "&:hover": {
                    borderColor: "#667eea",
                    backgroundColor: "#f8f9ff",
                  },
                }}
              >
                Daftar dengan Google
              </Button>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" color="#666">
                  Sudah punya akun?{" "}
                  <Button
                    variant="text"
                    sx={{
                      color: "#667eea",
                      textTransform: "none",
                      p: 0,
                      minWidth: "auto",
                      fontSize: "0.875rem",
                    }}
                    onClick={() => navigate("/login")}
                  >
                    Masuk sekarang!
                  </Button>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;